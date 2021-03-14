import { createReadStream, createWriteStream } from 'fs';

const dir = __dirname;
const rStream = createReadStream(`${dir}/books.csv`);
const wStream = createWriteStream(`${dir}/huge.csv`);

rStream.on('data', chunk  => {
  const [ head, ...lines] = chunk.toString().trim().split(/\r?\n/);
  wStream.write(`${head}\n`);
  const times = 10e6 / lines.length;
  const linesJoined = lines.join('\n'); 
  for (let i = 0; i < times; i++) {
    wStream.write(`${linesJoined}\n`);
  }
})
