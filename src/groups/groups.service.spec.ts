import * as typeorm from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'users/entities';
import { EntityNotFoundError, EntityConflictError, ArgumentsError } from 'core/errors';
import { Permission } from './enums';
import { Group } from './entities';
import { GroupsService } from './groups.service';

jest.mock('core/decorators', () => ({
  LogMethodCalls: () => jest.fn(),
}));

describe('GroupsService', () => {
  let service: GroupsService;
  const repository = {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneByName: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as Partial<typeorm.Repository<Group>>;
  const usersRepository = {
    findOne: jest.fn(),
  } as Partial<typeorm.Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        {
          provide: getRepositoryToken(Group),
          useValue: repository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: usersRepository,
        },
      ],
    }).compile();

    service = module.get<GroupsService>(GroupsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const id = '123e4567-e89b-12d3-a456-426614174000';
  const defaultGroup = { name: 'editors', permissions: [Permission.READ, Permission.WRITE] };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const dto = defaultGroup;

    it('should create group', () => {
      service.create(dto);
      expect(repository.save).toBeCalledWith(dto);
    });

    it('should throw EntityConflictError if name is used by another group', async () => {
      const err = { code: '23505' };
      jest.spyOn(repository, 'save').mockRejectedValue(err);
      await expect(service.create(dto)).rejects.toThrow(EntityConflictError);
    });

    it('should rethrow if error is not a known unique_violation error', async () => {
      const err = new Error('something went wrong');
      jest.spyOn(repository, 'save').mockRejectedValue(err);
      await expect(service.create(dto)).rejects.toThrow(err);
    });
  });

  describe('findAll', () => {
    it('should find all groups', () => {
      service.findAll();
      expect(repository.find).toBeCalled();
    });
  });

  describe('findOne', () => {
    it('should find the group by id', async () => {
      const group = { id, ...defaultGroup };
      jest.spyOn(repository, 'findOne').mockResolvedValue(group);
      expect(await service.findOne(id)).toBe(group);
    });

    it('should throw EntityNotFoundError if group not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne(id)).rejects.toThrow(EntityNotFoundError);
    });
  });

  describe('update', () => {
    it('should  update group', async () => {
      jest.spyOn(service, 'findOneByName').mockReturnValueOnce(null);
      const dto = { name: 'updated' };
      await service.update(id, dto);
      expect(repository.update).toBeCalledWith(id, dto);
    });

    it('should throw EntityConflictError if name is already used', async () => {
      jest
        .spyOn(service, 'findOneByName')
        .mockResolvedValue({ ...defaultGroup, id: 'another-id-same-name' });
      const dto = { name: 'non-unique-name' };
      await expect(service.update(id, dto)).rejects.toThrow(EntityConflictError);
    });

    it('should not check for entity conflict if name is not in the partial update DTO', async () => {
      const dto = { permissions: [] };
      await service.update(id, dto);
      expect(repository.update).toBeCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should remove group', () => {
      service.remove(id);
      expect(repository.delete).toBeCalledWith(id);
    });
  });

  describe('findOneByName', () => {
    it('should find group by name', () => {
      service.findOneByName('name');
      expect(repository.findOne).toBeCalledWith({ name: 'name' });
    });

    it('should find other groups using the same name thanks to the optional exceptId parameter', () => {
      service.findOneByName('name', 'my-own-id');
      expect(repository.findOne).toBeCalledWith({ name: 'name', id: typeorm.Not('my-own-id') });
    });
  });

  describe('addUsers', () => {
    it('should add users to group', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({ id, ...defaultGroup, users: [] });

      jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValueOnce({
          id: 'user1-id',
          username: 'user1',
          password: 'password1',
          age: 21,
        })
        .mockResolvedValueOnce({
          id: 'user2-id',
          username: 'user2',
          password: 'password2',
          age: 21,
        });
      const transaction = jest.fn(async asyncCallback => await asyncCallback({ save: jest.fn() }));
      jest
        .spyOn(typeorm, 'getConnection')
        .mockImplementation(() => (({ transaction } as unknown) as typeorm.Connection));

      await service.addUsers(id, { userIds: ['user1-id', 'user2-id'] });
      expect(transaction).toBeCalled();
    });

    it('should throw EntityNotFoundError if group not found', async () => {
      jest.spyOn(repository, 'findOne').mockReturnValue(undefined);
      await expect(service.addUsers(id, { userIds: ['user1-id', 'user2-id'] })).rejects.toThrow(
        EntityNotFoundError,
      );
    });

    it('should throw ArgumentsError if all userIds are wrong', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue({ id, ...defaultGroup, users: [] });

      jest
        .spyOn(usersRepository, 'findOne')
        .mockReturnValueOnce(undefined)
        .mockReturnValueOnce(undefined);

      await expect(service.addUsers(id, { userIds: ['user1-id', 'user2-id'] })).rejects.toThrow(
        ArgumentsError,
      );
    });
  });
});
