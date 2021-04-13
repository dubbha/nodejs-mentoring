import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  async findAll(loginSubstring?: string, limit?: number) {
    return (await this.usersRepository.find({ deletedAt: null }))
      .map(({ deletedAt, ...rest }) => ({ ...rest })) // eslint-disable-line @typescript-eslint/no-unused-vars
      .filter(({ login }) => login.match(new RegExp(loginSubstring, 'i')))
      .sort((a, b) => (a.login > b.login ? 1 : -1))
      .slice(0, limit);
  }

  findOne(id: string) {
    return this.usersRepository.findOne({ id, deletedAt: null });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update({ id }, updateUserDto);
  }

  async remove(id: string) {
    await this.usersRepository.softDelete(id);
  }

  findOneByLogin(login: string, exceptId?: string): Promise<User> {
    return this.usersRepository.findOne({
      login,
      deletedAt: null,
      ...(exceptId && { id: Not(exceptId) }),
    });
  }
}
