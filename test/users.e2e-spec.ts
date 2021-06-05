import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as request from 'supertest';
import { useContainer } from 'class-validator';
import { UsersController } from '../src/users/users.controller';
import { UsersService } from '../src/users/users.service';
import { HashService, LoggerService } from '../src/core/services';
import { UsernameNotUsedConstraint } from '../src/users/validators/username-not-used';
import { User } from '../src/users/entities/user.entity';

const validationError = (message: string | string[]) => ({
  statusCode: 400,
  message: Array.isArray(message) ? message : [message],
  error: 'Bad Request',
});

describe('Users (e2e)', () => {
  let app: INestApplication;
  const repository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  } as Partial<Repository<User>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [UsersController],
      providers: [
        UsersService,
        HashService,
        LoggerService,
        UsernameNotUsedConstraint,
        {
          provide: getRepositoryToken(User),
          useValue: repository,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    useContainer(app, { fallbackOnErrors: true });
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /users', () => {
    it('should return empty users list', () => {
      jest.spyOn(repository, 'find').mockImplementationOnce(() => Promise.resolve([]));
      return request(app.getHttpServer()).get('/users').expect(200).expect([]);
    });

    it('should validate limit query param if passed', () => {
      return request(app.getHttpServer())
        .get('/users?limit=abc')
        .expect(400)
        .expect(validationError('limit must be a number string'));
    });
  });

  describe('GET /users/:id', () => {
    it('should validate id param', () => {
      return request(app.getHttpServer())
        .get('/users/123')
        .expect(400)
        .expect(validationError('id must be a UUID'));
    });
  });

  describe('POST /users', () => {
    it('should validate CreateUserDto', () => {
      return request(app.getHttpServer())
        .post('/users')
        .set('Accept', 'application/json')
        .send({})
        .expect(400)
        .expect(
          validationError([
            'password must contain both letters and numbers',
            'password must be longer than or equal to 8 characters',
            'password must be a string',
            'age must not be greater than 130',
            'age must not be less than 4',
            'age must be a number conforming to the specified constraints',
          ]),
        );
    });
  });

  describe('PATCH /users/:id', () => {
    it('should validate CreateUserDto', () => {
      return request(app.getHttpServer())
        .patch('/users/123e4567-e89b-12d3-a456-426614174000')
        .set('Accept', 'application/json')
        .send({ password: 'qwerty', age: 150 })
        .expect(400)
        .expect(
          validationError([
            'password must contain both letters and numbers',
            'password must be longer than or equal to 8 characters',
            'age must not be greater than 130',
          ]),
        );
    });
  });

  describe('DELETE /users/:id', () => {
    it('should validate id param', () => {
      return request(app.getHttpServer())
        .delete('/users/123')
        .expect(400)
        .expect(validationError('id must be a UUID'));
    });
  });
});
