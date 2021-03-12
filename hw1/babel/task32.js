import csv from 'csvtojson';
import fs from 'fs';
import { logErrorIfAny } from './utils';

const dir = __dirname;
const inputFile = `${dir}/books.csv`;
const outputFile = `${dir}/books.json`;

const readStream = fs.createReadStream(inputFile).on('error', logErrorIfAny);

let timer;
const writeStream = fs.createWriteStream(outputFile)
  .on('error', logErrorIfAny)
  .on('close', () => {
    console.log(`Took ${Math.round(process.hrtime(start)[0])} seconds`);
    clearInterval(timer);
  });

const arrayJsonTransform = new Transform({
  transform(chunk, encoding, callback) {
    this.push(`${this.isNotAtFirstRow ? ',\n' : '[\n'}  ${chunk.toString('utf-8').trim()}`);
    this.isNotAtFirstRow = true;
    callback();
  },
  flush(callback) {
    const isEmpty = (!this.isNotAtFirstRow);
    this.push(isEmpty ? '[]' : '\n]\n');
    callback();
  }
});

const priceToNumberTransform = new Transform({
  transform(chunk, encoding, callback) {
    const { book, author, price } = JSON.parse(chunk.toString('utf-8'));
    this.push(JSON.stringify({ book, author, price: Number(price) }));
    callback();
  },
})

const start = process.hrtime();

pipeline(
  readStream,
  csv({
    headers: ['book', 'author', 'amount', 'price'],
    ignoreColumns: /amount/,
    downstreamFormat: 'line', // ndjson format
  }),
  priceToNumberTransform, // takes 1/3 less time without this transform
  arrayJsonTransform, // https://github.com/Keyang/node-csvtojson/issues/333
  writeStream,
  logErrorIfAny,
);

timer = setInterval(() => {
  console.log(`${Math.round(process.memoryUsage().heapUsed / 1024 /1024)}M`)
}, 10000);
