import csv from 'csvtojson';
import { createReadStream, createWriteStream } from 'fs';
import { Transform, pipeline } from 'stream';
import { logErrorIfAny } from './utils';

const dir = __dirname;
const filename = process.argv[2] || 'books';
const inputFile = `${dir}/${filename}.csv`;
const outputFile = `${dir}/${filename}.json`;

const readStream = createReadStream(inputFile).on('error', logErrorIfAny);

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

const writeStream = createWriteStream(outputFile).on('error', logErrorIfAny)

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
