import { LoggerService } from '../services';

export function LogMethodCalls() {
  return function (constructor: any) {
    const logger = new LoggerService(constructor.name);

    Object.getOwnPropertyNames(constructor.prototype)
      .filter(key => key !== 'constructor')
      .forEach(method => {
        const handler = {
          apply: function (target: any, thisArg: any, args: any) {
            logger.log(
              `${target.name} method called${args.length ? ` with ${JSON.stringify(args)}` : ''}`,
            );
            return target.apply(thisArg, args);
          },
        };
        constructor.prototype[method] = new Proxy(constructor.prototype[method], handler);
      });
  };
}
