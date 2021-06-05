import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
import { HashService } from '../core/services';
import { LogMethodCalls } from '../core/decorators';
import { CreateUserDto, UpdateUserDto } from './dto';
import { User } from './entities/user.entity';
import { EntityNotFoundError, EntityConflictError } from '../core/errors';

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

  findAll(usernameSubstring?: string, limit?: number) {
    return this.usersRepository.find({
      order: { username: 'ASC' },
      ...(limit && { take: limit }),
      ...(usernameSubstring && { where: { username: ILike(`%${usernameSubstring}%`) } }),
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
    const { username, password } = dto;
    if (username) {
      if (await this.findOneByUsername(username, id)) {
        throw new EntityConflictError(`username (${username}) is already used by another user`);
      }
    }
    const partial = password ? { ...dto, password: await this.hashService.hash(password) } : dto;
    return this.usersRepository.update({ id }, partial);
  }

  remove(id: string) {
    return this.usersRepository.softDelete(id);
  }

  findOneByUsername(username: string, exceptId?: string): Promise<User> {
    return this.usersRepository.findOne({
      username,
      ...(exceptId && { id: Not(exceptId) }),
    });
  }

  async validateUser(username: string, password: string) {
    // https://github.com/ranisalt/node-argon2/wiki/Migrating-from-another-hash-function
    const { password: foundPassword, id } = await this.usersRepository.findOne({
      where: { username },
      select: ['password', 'id'], // https://github.com/typeorm/typeorm/issues/5816
    });

    if (foundPassword.startsWith('$argon2id$')) {
      if (await this.hashService.verify(foundPassword, password)) {
        return await this.usersRepository.findOne(id);
      }
    } else {
      if (foundPassword === password) {
        await this.update(foundPassword, { password }); // rehash
        return await this.usersRepository.findOne(id);
      }
    }
    return null;
  }
}
