const readline = require('readline');
const { logErrorIfAny } = require('./utils');

const { stdin, stdout } = process;

readline.createInterface({ input: stdin })
  .on('error', logErrorIfAny)
  .on('line', input => {
    stdout.write(
      `${input.split('').reverse().join('')}\n`,
      logErrorIfAny,
    );
  });
