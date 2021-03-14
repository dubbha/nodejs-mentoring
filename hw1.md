# Homework 1

## Task 1.1
Using [readline](https://nodejs.org/api/readline.html) to read line-by-line, [process.stdout](https://nodejs.org/api/process.html#process_process_stdout) to write
```
npm run task-1-1
npm run task-1-1:watch
```

## Task 1.2
Using [csvtojson](https://github.com/Keyang/node-csvtojson#csvtojson) to generate [NDJSON](http://ndjson.org/) format file, and then [createReadStream](https://nodejs.org/api/fs.html#fs_fs_createreadstream_path_options) and [createWriteStream](https://nodejs.org/api/fs.html#fs_fs_createwritestream_path_options), [pipeline](https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback) and [Transform](https://nodejs.org/api/stream.html#stream_class_stream_transform) to make it a real JSON: wrapped in array, no comma after the last line
```
npm run task-1-2
npm run task-1-2:watch
```
Test for memory leakage on huge data (10KK lines), convert CSV to JSON, then back to CSV again
```
npm run task-1-2:hugify
npm run task-1-2:huge:csvtojson
npm run task-1-2:huge:reverse
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

### Using TypeScript
Using [ts-node](https://github.com/TypeStrong/ts-node#readme) (dev, ts-node can be used in prod [with --transpile-only](https://github.com/TypeStrong/ts-node/issues/104) but has a bigger memory footprint comparing to node running a pre-transpiled code)
```
npm run task-1-3-1:ts:dev
npm run task-1-3-2:ts:dev
npm run task-1-3-2:ts:dev:hugify
npm run task-1-3-2:ts:dev:huge:csvtojson
npm run task-1-3-2:ts:dev:huge:reverse
```
Transpile with tsc, run with node (prod ready, also: [babel vs tsc for typescript](https://www.typescriptlang.org/docs/handbook/babel-with-typescript.html#babel-vs-tsc-for-typescript))
```
npm run task-1-3-1:ts:prod
npm run task-1-3-2:ts:prod
npm run task-1-3-2:ts:prod:huge:csvtojson
npm run task-1-3-2:ts:prod:huge:reverse
```


