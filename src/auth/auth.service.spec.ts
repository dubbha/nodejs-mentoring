import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  const jwtService = { sign: jest.fn() };
  const usersService = { validateUser: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, JwtService, UsersService],
    })
      .overrideProvider(JwtService)
      .useValue(jwtService)
      .overrideProvider(UsersService)
      .useValue(usersService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  const id = '123e4567-e89b-12d3-a456-426614174000';
  const defaultUser = { id, username: 'user', password: 'password', age: 20, isDeleted: false };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user', async () => {
      jest.spyOn(usersService, 'validateUser').mockResolvedValue(defaultUser);
      expect(await service.validateUser('user', 'pass')).toBe(defaultUser);
    });

    it('should return null on user validation error', async () => {
      jest.spyOn(usersService, 'validateUser').mockRejectedValue(new Error());
      expect(await service.validateUser('user', 'pass')).toBeNull();
    });
  });

  describe('login', () => {
    it('should validate user', () => {
      jwtService.sign.mockReturnValue('token');
      expect(service.login(defaultUser)).toEqual({ access_token: 'token' });
    });

    // it('should return null on user validation error', async () => {
    //   jest.spyOn(usersService, 'validateUser').mockRejectedValue(new Error());
    //   expect(await service.validateUser('user', 'pass')).toBeNull();
    // });
  });
});
