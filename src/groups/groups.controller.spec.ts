import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { LoggerService } from 'core/services';
import { EntityNotFoundError, EntityConflictError, ArgumentsError } from 'core/errors';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Permission } from './enums';

describe('GroupsController', () => {
  let controller: GroupsController;
  const service = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findOneByUsername: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addUsers: jest.fn(),
  } as Partial<GroupsService>;

  const loggerService = {
    setContext: jest.fn(),
    controllerMethodError: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [GroupsService, LoggerService],
    })
      .overrideProvider(GroupsService)
      .useValue(service)
      .overrideProvider(LoggerService)
      .useValue(loggerService)
      .compile();

    controller = module.get<GroupsController>(GroupsController);
  });

  const id = '123e4567-e89b-12d3-a456-426614174000';
  const defaultGroup = { name: 'editors', permissions: [Permission.READ, Permission.WRITE] };

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const dto = { ...defaultGroup };

    it('should create group', () => {
      controller.create(dto);
      expect(service.create).toBeCalledWith(dto);
    });

    it('should log and rethrow to HTTP on error', async () => {
      const err = new Error('error');
      jest.spyOn(service, 'create').mockRejectedValueOnce(err);

      await expect(controller.create(dto)).rejects.toThrow(err);
      expect(loggerService.controllerMethodError).toBeCalledWith(err, 'POST /', [dto]);
    });
  });

  describe('findAll', () => {
    it('should find all groups', () => {
      controller.findAll();
      expect(service.findAll).toBeCalled();
    });

    it('should log and rethrow to HTTP on error', async () => {
      const err = new Error('error');
      jest.spyOn(service, 'findAll').mockRejectedValueOnce(err);

      await expect(controller.findAll()).rejects.toThrow(err);
      expect(loggerService.controllerMethodError).toBeCalledWith(err, 'GET /');
    });
  });

  describe('findOne', () => {
    it('should return group by id if found', async () => {
      (service.findOne as jest.Mock).mockResolvedValue(defaultGroup);
      expect(await controller.findOne({ id })).toBe(defaultGroup);
    });

    it('should throw NotFoundException if group not found', async () => {
      (service.findOne as jest.Mock).mockRejectedValue(new EntityNotFoundError());
      await expect(controller.findOne({ id })).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should partially update group passing id and DTO to service', async () => {
      const params = { id };
      const { name } = defaultGroup;
      const dto = { name };

      await controller.update(params, dto);
      expect(service.update).toBeCalledWith(id, dto);
    });

    it('should throw if the new name is already used by another group', async () => {
      const params = { id };
      const { name } = defaultGroup;
      const dto = { name };
      (service.update as jest.Mock).mockRejectedValue(new EntityConflictError());

      await expect(controller.update(params, dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    it('should pass id of the group to be removed', () => {
      const params = { id };

      controller.remove(params);
      expect(service.remove).toBeCalledWith(params.id);
    });

    it('should log and rethrow to HTTP on error', async () => {
      const err = new Error('error');
      jest.spyOn(service, 'remove').mockRejectedValueOnce(err);

      await expect(controller.remove({ id })).rejects.toThrow(err);
      expect(loggerService.controllerMethodError).toBeCalledWith(err, 'DELETE /:id', [{ id }]);
    });
  });

  describe('addUsers', () => {
    const params = { id };
    const dto = { userIds: ['123456', '234567'] };

    it('should add users to the group', () => {
      controller.addUsers(params, dto);
      expect(service.addUsers).toBeCalledWith(params.id, dto);
    });

    it('should log and rethrow to HTTP on error', async () => {
      const err = new ArgumentsError('error');
      jest.spyOn(service, 'addUsers').mockRejectedValueOnce(err);

      await expect(controller.addUsers(params, dto)).rejects.toThrow(BadRequestException);
      expect(loggerService.controllerMethodError).toBeCalledWith(err, 'POST /:id/add-users', [
        { id },
        dto,
      ]);
    });
  });
});
