import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { EntityConflictError, EntityNotFoundError } from '../core/errors';
import { LoggerService } from '../core/services';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByLogin: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  } as Partial<UsersService>;

  const loggerService = {
    setContext: jest.fn(),
    controllerMethodError: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, LoggerService],
    })
      .overrideProvider(UsersService)
      .useValue(service)
      .overrideProvider(LoggerService)
      .useValue(loggerService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  const id = '123e4567-e89b-12d3-a456-426614174000';
  const defaultUser = { id, login: 'login', password: 'password', age: 20, isDeleted: false };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create user', () => {
      const { login, password, age } = defaultUser;
      const dto = { login, password, age };

      controller.create(dto);
      expect(service.create).toBeCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should pass loginSubtring and limit if provided', () => {
      controller.findAll({ loginSubstring: 'sub', limit: 12 });
      expect(service.findAll).toBeCalledWith('sub', 12);
    });

    it('should call service with loginSubtring and limit undefined if not provided', () => {
      controller.findAll({});
      expect(service.findAll).toBeCalledWith(undefined, undefined);
    });
  });

  describe('findOne', () => {
    it('should return user by id if found', async () => {
      (service.findOne as jest.Mock).mockImplementation(() => Promise.resolve(defaultUser));
      expect(await controller.findOne({ id })).toBe(defaultUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      (service.findOne as jest.Mock).mockImplementation(() =>
        Promise.reject(new EntityNotFoundError()),
      );
      await expect(controller.findOne({ id })).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should partially update user passing id and DTO to service', async () => {
      const params = { id };
      const { age } = defaultUser;
      const dto = { age };

      await controller.update(params, dto);
      expect(service.update).toBeCalledWith(id, dto);
    });

    it('should throw if the new login is already used by another user', async () => {
      const params = { id };
      const { age, login } = defaultUser;
      const dto = { age, login };
      (service.update as jest.Mock).mockImplementation(() =>
        Promise.reject(new EntityConflictError()),
      );

      await expect(controller.update(params, dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should pass id of the user to be removed', () => {
      const params = { id };

      controller.remove(params);
      expect(service.remove).toBeCalledWith(params.id);
    });
  });
});
