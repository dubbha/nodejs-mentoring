import csv from 'csvtojson';
import { createReadStream, createWriteStream } from 'fs';
import { Transform, pipeline } from 'stream';
import { logErrorIfAny } from './utils';
import { ExtendedTransform } from './extended-transform';

const dir = __dirname;
const filename = process.argv[2] || 'books';
const inputFile = `${dir}/${filename}.csv`;
const outputFile = `${dir}/${filename}.json`;

const readStream = createReadStream(inputFile).on('error', logErrorIfAny);

const priceToNumberTransform = new Transform({
  transform(chunk, encoding, callback) {
    const { book, author, price } = JSON.parse(chunk.toString('utf-8'));
    this.push(JSON.stringify({ book, author, price: Number(price) }));
    callback();
  },
})

const arrayJsonTransform = new ExtendedTransform({
  transform(chunk, encoding, callback) {
    this.push(`${this.isNotAtFirstChunk ? ',\n' : '[\n'}  ${chunk.toString('utf-8').trim()}`);
    this.isNotAtFirstChunk = true;
    callback();
  },
  flush(callback) {
    const isEmpty = (!this.isNotAtFirstChunk);
    this.push(isEmpty ? '[]' : '\n]\n');
    callback();
  }
});

const start = process.hrtime();
let timer: NodeJS.Timeout;
const writeStream = createWriteStream(outputFile)
  .on('error', logErrorIfAny)
  .on('close', () => {
    console.log(`Took ${Math.round(process.hrtime(start)[0])} seconds`);
    clearInterval(timer);
  });

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
  const s = Math.round(process.hrtime(start)[0]);
  const M = Math.round(process.memoryUsage().heapUsed / 1024 /1024);
  console.log(`${s}s ${M}M`);
}, 10000);
