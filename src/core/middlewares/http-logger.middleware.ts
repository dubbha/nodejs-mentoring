import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggerService } from '../services';

@Injectable()
export class HttpLogger implements NestMiddleware {
  constructor(private logger: LoggerService) {
    logger.setContext('HTTP');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const { baseUrl, path, method, query, body } = req;

    this.logger.debug(
      `${method} ${baseUrl}${path} called${
        Object.keys(query).length ? `, query: ${JSON.stringify(query)}` : ''
      }${
        Object.keys(body).length
          ? `, body: ${JSON.stringify(
              Object.keys(body).reduce(
                (acc, cur) => ({ ...acc, [cur]: cur.match('password') ? '***' : body[cur] }),
                {},
              ),
            )}`
          : ''
      }`,
    );

    next();
  }
}
