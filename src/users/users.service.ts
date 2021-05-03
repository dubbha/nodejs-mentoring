import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
import * as argon2 from 'argon2';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './entities/user.entity';

// https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
export const hash = (plain: string) =>
  argon2.hash(plain, { type: argon2.argon2id, timeCost: 2, memoryCost: 15360 });

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto) {
    // https://github.com/typeorm/typeorm/issues/4591
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, deletedAt, ...result } = await this.usersRepository.save({
      ...dto,
      password: await hash(dto.password),
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

  findOne(id: string) {
    return this.usersRepository.findOne({ id });
  }

  async update(id: string, dto: UpdateUserDto) {
    const { password } = dto;
    const partial = password ? { ...dto, password: await hash(password) } : dto;
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
      return await argon2.verify(password, dto.password);
    } else {
      if (password === dto.password) {
        await this.update(id, { password }); // rehash
        return true;
      }
      return false;
    }
  }
}
