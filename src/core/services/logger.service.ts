import { Logger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {
  controllerMethodError(e: Error, methodName: string, args = []): any {
    this.error(
      `${methodName} called${args.length ? ` with ${JSON.stringify(args)}` : ''}, ${
        e.constructor.name
      }: ${e.message}`,
    );
  }
}
