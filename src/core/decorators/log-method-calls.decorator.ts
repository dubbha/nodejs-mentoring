import { LoggerService } from '../services';

export function LogMethodCalls() {
  return function (constructor: any) {
    const logger = new LoggerService(constructor.name);

    Object.getOwnPropertyNames(constructor.prototype)
      .filter(key => key !== 'constructor')
      .forEach(method => {
        const handler = {
          apply: function (target: any, thisArg: any, args: any) {
            let argsPart = '';
            if (args.length) {
              const params = target
                .toString()
                .match(/\((.*)\)/)[1]
                .split(',');

              const safeToLogArgs = args.map((arg, i) =>
                params[i].match('password') ? '***' : arg,
              );

              argsPart = ` with ${JSON.stringify(safeToLogArgs)}`;
            }

            logger.log(`${target.name} method called${argsPart}`);
            return target.apply(thisArg, args);
          },
        };
        constructor.prototype[method] = new Proxy(constructor.prototype[method], handler);
      });
  };
}
