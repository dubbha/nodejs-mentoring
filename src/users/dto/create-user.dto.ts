import { IsString, MinLength } from 'class-validator';
import { UsernameNotUsed } from '../validators/username-not-used';
import { BaseUserDto } from './base-user.dto';

export class CreateUserDto extends BaseUserDto {
  @UsernameNotUsed()
  @IsString()
  @MinLength(3)
  username: string;
}
