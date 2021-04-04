import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';
import { UsersService } from './users.service';

jest.mock('uuid');

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const id = '123e4567-e89b-12d3-a456-426614174000';
  const defaultUser = { id, login: 'login', password: 'password', age: 20 };

  it('should create user', () => {
    uuidv4.mockImplementation(() => id);
    service.create(defaultUser);
    expect(service.findOne(id)).toEqual({
      ...defaultUser,
      id,
      isDeleted: false,
    });
  });

  it('should update user with a partial DTO', () => {
    uuidv4.mockImplementation(() => id);
    service.create(defaultUser);
    service.update(id, { login: 'login2', age: 22 });
    expect(service.findOne(id)).toEqual({
      ...defaultUser,
      login: 'login2',
      age: 22,
      isDeleted: false,
    });
  });

  it('should remove user softly', () => {
    uuidv4.mockImplementation(() => id);
    service.create(defaultUser);
    service.remove(id);
    expect(service.findOne(id)).toEqual({
      ...defaultUser,
      isDeleted: true,
    });
  });

  it('should find all non-deleted users sorted by login, not including isDeleted fields', () => {
    const id2 = '9699ee27-68e6-4835-81dc-d8803e1984ad';
    const id3 = '6b127d42-31c4-430d-945a-bcb0f49056ac';

    uuidv4.mockImplementationOnce(() => id);
    uuidv4.mockImplementationOnce(() => id2);
    uuidv4.mockImplementationOnce(() => id3);

    service.create(defaultUser);
    service.create({ ...defaultUser, login: 'login2' });
    service.create({ ...defaultUser, login: '1login' });

    expect(service.findAll()).toEqual([
      { ...defaultUser, login: '1login', id: id3 },
      { ...defaultUser, login: 'login', id: id },
      { ...defaultUser, login: 'login2', id: id2 },
    ]);
  });

  it('should limit the number of search results', () => {
    const id2 = '9699ee27-68e6-4835-81dc-d8803e1984ad';
    const id3 = '6b127d42-31c4-430d-945a-bcb0f49056ac';

    uuidv4.mockImplementationOnce(() => id);
    uuidv4.mockImplementationOnce(() => id2);
    uuidv4.mockImplementationOnce(() => id3);

    service.create(defaultUser);
    service.create({ ...defaultUser, login: 'login2' });
    service.create({ ...defaultUser, login: '1login' });

    expect(service.findAll('log', 2)).toEqual([
      { ...defaultUser, login: '1login', id: id3 },
      { ...defaultUser, login: 'login', id: id },
    ]);
  });

  it('should filter results by the loginSubstring', () => {
    const id2 = '9699ee27-68e6-4835-81dc-d8803e1984ad';
    const id3 = '6b127d42-31c4-430d-945a-bcb0f49056ac';

    uuidv4.mockImplementationOnce(() => id);
    uuidv4.mockImplementationOnce(() => id2);
    uuidv4.mockImplementationOnce(() => id3);

    service.create(defaultUser);
    service.create({ ...defaultUser, login: 'login2' });
    service.create({ ...defaultUser, login: '1login' });

    expect(service.findAll('1lo')).toEqual([{ ...defaultUser, login: '1login', id: id3 }]);
  });

  it('should find user by login', async () => {
    uuidv4.mockImplementationOnce(() => id);
    service.create(defaultUser);
    const user = await service.findOneByLogin('login');
    expect(user).toEqual({ ...defaultUser, login: 'login', id, isDeleted: false });
  });

  it('should find user by login, expect for user with the provided id', async () => {
    uuidv4.mockImplementationOnce(() => id);
    service.create(defaultUser);
    const user = await service.findOneByLogin('login', id);
    expect(user).toBeUndefined();
  });
});
