import { LoginNotUsed } from '../validators/login-not-used';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto {
  @LoginNotUsed()
  login: string;
}
