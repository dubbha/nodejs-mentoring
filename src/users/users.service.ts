import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, ILike } from 'typeorm';
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

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.usersRepository.update({ id }, updateUserDto);
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
}
