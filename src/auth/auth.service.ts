import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LogMethodCalls } from 'core/decorators';
import { UsersService } from 'users/users.service';
import { User } from 'users/entities';

@Injectable()
@LogMethodCalls()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    try {
      return await this.usersService.validateUser(username, password);
    } catch {
      return null;
    }
  }

  login(user: User) {
    const { username, id: sub } = user;
    return { access_token: this.jwtService.sign({ username, sub }) };
  }
}
