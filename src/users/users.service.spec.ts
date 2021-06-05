import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
import { UsersService } from './users.service';
import { HashService } from '../core/services';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  const repository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  } as Partial<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        HashService,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const id = '123e4567-e89b-12d3-a456-426614174000';
  const defaultUser = { id, username: 'user', password: 'password', age: 20 };

  it('should create user', async () => {
    jest.spyOn(repository, 'save').mockReturnValue(
      Promise.resolve({
        ...defaultUser,
        password: 'hashedPasswordToBeOmittedFromResponse',
        deletedAt: null,
      }),
    );
    const dto = {
      username: defaultUser.username,
      password: defaultUser.password,
      age: defaultUser.age,
    };
    expect(await service.create(dto)).toEqual({
      username: dto.username,
      age: dto.age,
      id: defaultUser.id,
    });
    expect(repository.save).toBeCalledWith({
      ...dto,
      password: expect.stringContaining('$argon2id$'),
    });
  });

  it('should update user with a partial DTO', async () => {
    const dto = { username: 'user2', age: 22 };
    jest.spyOn(repository, 'findOne').mockReturnValue(null);
    await service.update(id, dto);
    expect(repository.update).toBeCalledWith({ id }, dto);
  });

  it('should remove user softly', () => {
    service.remove(id);
    expect(repository.softDelete).toBeCalledWith(id);
  });

  it('should find all non-deleted users sorted by username', () => {
    service.findAll();
    expect(repository.find).toBeCalledWith({
      order: { username: 'ASC' },
    });
  });

  it('should limit the number of search results', () => {
    service.findAll('user', 2);
    expect(repository.find).toBeCalledWith({
      order: { username: 'ASC' },
      take: 2,
      where: { username: ILike('%user%') },
    });
  });

  it('should filter results by the usernameSubstring', () => {
    service.findAll('1use');
    expect(repository.find).toBeCalledWith({
      order: { username: 'ASC' },
      where: { username: ILike('%1use%') },
    });
  });

  it('should find user by username', () => {
    service.findOneByUsername('user');
    expect(repository.findOne).toBeCalledWith({ username: 'user' });
  });

  it('should find user by username, expect for user with the provided id', () => {
    service.findOneByUsername('user', id);
    expect(repository.findOne).toBeCalledWith({ username: 'user', id: Not(id) });
  });
});
