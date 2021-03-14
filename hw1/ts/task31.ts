import { createInterface } from 'readline';
import { logErrorIfAny } from './utils';

const { stdin, stdout } = process;

createInterface({ input: stdin })
  .on('error', logErrorIfAny)
  .on('line', (input: string) => {
    stdout.write(
      `${input.split('').reverse().join('')}\n`,
      logErrorIfAny,
    );
  });
