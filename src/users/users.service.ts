import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [];

  create(createUserDto: CreateUserDto) {
    this.users.push({
      ...createUserDto,
      id: uuidv4(),
      isDeleted: false,
    });
  }

  findAll(loginSubstring?: string, limit?: number) {
    return this.users
      .filter(({ isDeleted }) => !isDeleted)
      .map(({ isDeleted, ...rest }) => ({ ...rest })) // eslint-disable-line @typescript-eslint/no-unused-vars
      .filter(({ login }) => login.match(new RegExp(loginSubstring, 'i')))
      .sort((a, b) => (a.login > b.login ? 1 : -1))
      .slice(0, limit);
  }

  findOne(id: string) {
    return this.users.find(user => user.id === id);
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    this.users = this.users.map(user => (user.id === id ? { ...user, ...updateUserDto } : user));
  }

  remove(id: string) {
    this.users = this.users.map(user => (user.id === id ? { ...user, isDeleted: true } : user));
  }

  findOneByLogin(login: string, exceptId?: string): Promise<User> {
    return Promise.resolve(this.users.find(user => user.login === login && user.id !== exceptId));
  }
}
