import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { LoggerService } from 'core/services';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

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

  const id = '123e4567-e89b-12d3-a456-426614174000';
  const defaultUser = { id, username: 'user', password: 'password', age: 20, isDeleted: false };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should login', async () => {
    await controller.login({ user: defaultUser });
    expect(service.login).toBeCalledWith(defaultUser);
  });

  it('should log on login error', async () => {
    jest.spyOn(service, 'login').mockImplementation(() => {
      throw new Error();
    });
    await controller.login({ user: defaultUser });
    expect(loggerService.controllerMethodError).toBeCalled();
  });
});
