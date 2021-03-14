import { Transform, TransformOptions, TransformCallback } from 'stream';

interface ExtendedTransformOptions extends TransformOptions {
  transform?(this: ExtendedTransform, chunk: any, encoding: BufferEncoding, callback: TransformCallback): void;
  flush?(this: ExtendedTransform, callback: TransformCallback): void;
}

export class ExtendedTransform extends Transform {
  isNotAtFirstChunk = false;
  constructor(options: ExtendedTransformOptions) {
    super(options);
  }
}
