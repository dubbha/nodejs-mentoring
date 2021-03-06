import csv from 'csvtojson';
import fs from 'fs';
import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { logErrorIfAny } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dir = __dirname;
const inputFile = `${dir}/books.csv`;
const txtOutputFile = `${dir}/books.txt`;
const jsonOutputFile = `${dir}/books.json`;

const txtWriteStream = fs.createWriteStream(txtOutputFile).on('error', logErrorIfAny);
let count = 0;
csv()
  .fromFile(inputFile)
  .subscribe(
    json => {
      const { Book, Author, Price } = json;
      const formattedJson = {
        book: Book,
        author: Author,
        price: Number(Price),
      };
      txtWriteStream.write(
        `${JSON.stringify(formattedJson)}\n`,
        logErrorIfAny,
      );
      count++;
    },
    err => console.error(err),
    () => {
      const readInterface = readline.createInterface({
        input: fs.createReadStream(txtOutputFile).on('error', logErrorIfAny),
      });
      const jsonWriteStream = fs.createWriteStream(jsonOutputFile).on('error', logErrorIfAny);

      let curLineNumber = 0;
      readInterface.on('line', line => {
        jsonWriteStream.write(
          `${!curLineNumber ? '[\n' : ''}\t${
            line
          }${curLineNumber === count - 1 ? '\n]\n' : ',\n'}`,
          logErrorIfAny,
        );
        curLineNumber++;
      })
    },
  );
