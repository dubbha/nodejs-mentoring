import csv from 'csvtojson';
import { createReadStream, createWriteStream } from 'fs';
import { Transform, pipeline } from 'stream';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { logErrorIfAny } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dir = __dirname;
const inputFile = `${dir}/books.csv`;
const outputFile = `${dir}/books.json`;

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
