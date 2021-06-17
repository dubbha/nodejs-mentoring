import { LoggerService } from './logger.service';

const mock = jest.fn();
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: jest.fn().mockImplementation(function () {
    this.error = mock;
    return this;
  }),
}));

describe('LoggerService', () => {
  const service = new LoggerService();

  it('should log a controller method call error', async () => {
    const err = new Error('err');
    await service.controllerMethodError(err, 'method');
    expect(mock).toBeCalledWith('method called, Error: err');
  });

  it('should log a controller method call error with arguments', async () => {
    const err = new Error('err');
    await service.controllerMethodError(err, 'method', ['a', 1]);
    expect(mock).toBeCalledWith(`method called with ["a",1], Error: err`);
  });
});
