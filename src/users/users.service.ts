import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
import { HashService } from '../core/services';
import { LogMethodCalls } from '../core/decorators';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';
import { EntityNotFoundError, EntityConflictError, UnauthorizedError } from '../core/errors';

@Injectable()
@LogMethodCalls()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
    private hashService: HashService,
  ) {}

  async create(dto: CreateUserDto) {
    // https://github.com/typeorm/typeorm/issues/4591
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, deletedAt, ...result } = await this.usersRepository.save({
      ...dto,
      password: await this.hashService.hash(dto.password),
    });
    return result;
  }

  findAll(loginSubstring?: string, limit?: number) {
    return this.usersRepository.find({
      order: { login: 'ASC' },
      ...(limit && { take: limit }),
      ...(loginSubstring && { where: { login: ILike(`%${loginSubstring}%`) } }),
    });
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOne({ id });
    if (!user) {
      throw new EntityNotFoundError(`user with id (${id}) not found`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const { login, password } = dto;
    if (login) {
      if (await this.findOneByLogin(login, id)) {
        throw new EntityConflictError(`login (${login}) is already used by another user`);
      }
    }
    const partial = password ? { ...dto, password: await this.hashService.hash(password) } : dto;
    return this.usersRepository.update({ id }, partial);
  }

  remove(id: string) {
    return this.usersRepository.softDelete(id);
  }

  findOneByLogin(login: string, exceptId?: string): Promise<User> {
    return this.usersRepository.findOne({
      login,
      ...(exceptId && { id: Not(exceptId) }),
    });
  }

  async login(dto: LoginDto) {
    // https://github.com/ranisalt/node-argon2/wiki/Migrating-from-another-hash-function
    const { password, id } = await this.usersRepository.findOne({
      where: { login: dto.login },
      select: ['password', 'id'], // https://github.com/typeorm/typeorm/issues/5816
    });

    if (password.startsWith('$argon2id$')) {
      if (await this.hashService.verify(password, dto.password)) {
        return true;
      }
    } else {
      if (password === dto.password) {
        await this.update(id, { password }); // rehash
        return true;
      }
    }
    throw new UnauthorizedError('username or password is incorrect');
  }
}
