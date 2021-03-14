import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream';
import { ExtendedTransform } from './extended-transform'
import { logErrorIfAny } from './utils';

const dir = __dirname;
const filename = process.argv[2] || 'books';
const inputFile = `${dir}/${filename}.json`;
const outputFile = `${dir}/${filename}.reverse.csv`;

const readStream = createReadStream(inputFile).on('error', logErrorIfAny);

let tail = '';
let tailsCount = 0;
const jsonToCsvTransform = new ExtendedTransform({
  transform(chunk, encoding, callback) {
    if (tail) tailsCount++;

    const lines = `${tail}${
        chunk.toString('utf-8').replace(/^\[\n/g, '').replace(/\]/g, '')
      }`.split('\n')
        .map(line => line.trim().replace(/,$/, '').replace(/[{}"]/g, ''))

    if (!this.isNotAtFirstChunk) { // create csv header
      const header = lines[0]
        .replace(/:[^,]+/g, '')
        .split(',')
        .map(col => `${col[0].toUpperCase()}${col.substr(1)}`)
        .join(',')
      lines.unshift(header);
    }

    tail = lines.pop() || '';

    this.push(`${lines
      .filter(Boolean)
      .map(line => line.split(',').map(cell => cell.substr(cell.indexOf(':') + 1)))
      .join('\n')}\n`);

    this.isNotAtFirstChunk = true;
    callback();
  }
});

const start = process.hrtime();
let timer: NodeJS.Timeout;
const writeStream = createWriteStream(outputFile)
  .on('error', logErrorIfAny)
  .on('close', () => {
    const s = Math.round(process.hrtime(start)[0]);
    console.log(`Took ${s} seconds, restored ${tailsCount} split lines`);
    clearInterval(timer);
  });

pipeline(
  readStream,
  jsonToCsvTransform,
  writeStream,
  logErrorIfAny,
);

timer = setInterval(() => {
  const s = Math.round(process.hrtime(start)[0]);
  const M = Math.round(process.memoryUsage().heapUsed / 1024 /1024);
  console.log(`${s}s ${M}M`);
}, 5000);
