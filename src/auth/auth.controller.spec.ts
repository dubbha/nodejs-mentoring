import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoggerService } from '../core/services';

describe('AuthController', () => {
  let controller: AuthController;
  const service = {
    validateUser: jest.fn(),
    login: jest.fn(),
  } as Partial<AuthService>;
  const loggerService = {
    setContext: jest.fn(),
    controllerMethodError: jest.fn(),
  };
  const jwtService = { sign: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, JwtService, LoggerService],
    })
      .overrideProvider(AuthService)
      .useValue(service)
      .overrideProvider(LoggerService)
      .useValue(loggerService)
      .overrideProvider(JwtService)
      .useValue(jwtService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
