import readline from 'readline';
import { logErrorIfAny } from './utils.js';

const { stdin, stdout } = process;

readline.createInterface({ input: stdin })
  .on('error', logErrorIfAny)
  .on('line', input => {
    stdout.write(
      `${input.split('').reverse().join('')}\n`,
      logErrorIfAny,
    );
  });
