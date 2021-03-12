# Homework 1

## Task 1.1
Using [readline](https://nodejs.org/api/readline.html) to read line-by-line, [process.stdout](https://nodejs.org/api/process.html#process_process_stdout) to write
```
npm run task-1-1
npm run task-1-1:watch
```

## Task 1.2
Using [csvtojson](https://github.com/Keyang/node-csvtojson#csvtojson) v2 [line-by-line processing](https://github.com/Keyang/node-csvtojson/blob/master/docs/csvtojson-v2.md#add-asynchronous-line-by-line-processing-support) to generate JSON-like text file, and then readline, [fs.createReadStream](https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options) and [fs.createWriteStream](https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options) to make it a real JSON
```
npm run task-1-2
npm run task-1-2:watch
```
Test for memory leakage on huge data (10KK lines)
```
npm run task-1-2:huge
```

## Task 1.3

### Using Babel
Using [babel-node](https://babeljs.io/docs/en/babel-node) (dev only)
```
npm run task-1-3-1:babel:dev
npm run task-1-3-2:babel:dev
```
Watch mode: using [nodemon](https://github.com/remy/nodemon#nodemon) and babel-node (dev only)
```
npm run task-1-3-1:babel:dev:watch
npm run task-1-3-2:babel:dev:watch
```
Transpile with babel, run with node (prod ready)
```
npm run task-1-3-1:babel:prod
npm run task-1-3-2:babel:prod
```

### Using ECMAScript Modules

Node.js fully supports ECMAScript modules now.
<br>[Stability: 1 - Experimental](https://nodejs.org/dist/latest-v14.x/docs/api/esm.html#esm_modules_ecmascript_modules) in **v14**
<br>[Stability: 2 - Stable](https://nodejs.org/api/esm.html#esm_modules_ecmascript_modules) in **v15**
```
npm run task-1-3-1:esm
npm run task-1-3-2:esm
```
