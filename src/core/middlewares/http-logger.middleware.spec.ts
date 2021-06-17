import { Test, TestingModule } from '@nestjs/testing';
import { Request, Response } from 'express';
import { HttpLogger } from './http-logger.middleware';
import { LoggerService } from '../services';

describe('HttpLogger', () => {
  let logger: HttpLogger;
  const loggerService = {
    setContext: jest.fn(),
    debug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HttpLogger],
      providers: [LoggerService],
    })
      .overrideProvider(LoggerService)
      .useValue(loggerService)
      .compile();

    logger = module.get<HttpLogger>(HttpLogger);
  });

  const nextFn = jest.fn();

  it('should be defined', () => {
    expect(logger).toBeDefined();
  });

  it('should log http requests', () => {
    logger.use(
      { baseUrl: 'base.url', path: '/path', method: 'method', query: {}, body: {} } as Request,
      {} as Response,
      nextFn,
    );
    expect(loggerService.debug).toBeCalledWith('method base.url/path called');
    expect(nextFn).toBeCalled();
  });

  it('should log query params and body data', () => {
    logger.use(
      {
        baseUrl: 'base.url',
        path: '/path',
        method: 'method',
        query: { user: 'user' } as any,
        body: { age: 20 },
      } as Request,
      {} as Response,
      nextFn,
    );
    expect(loggerService.debug).toBeCalledWith(
      'method base.url/path called, query: {"user":"user"}, body: {"age":20}',
    );
  });

  it('should mask sensitive data', () => {
    logger.use(
      {
        baseUrl: 'base.url',
        path: '/path',
        method: 'method',
        query: {},
        body: { password: 'password' },
      } as Request,
      {} as Response,
      nextFn,
    );
    expect(loggerService.debug).toBeCalledWith(
      'method base.url/path called, body: {"password":"***"}',
    );
    expect(nextFn).toBeCalled();
  });
});
