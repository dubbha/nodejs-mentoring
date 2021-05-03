import { OmitType } from '@nestjs/swagger';
import { BaseUserDto } from './base-user.dto';

export class LoginDto extends OmitType(BaseUserDto, ['age'] as const) {}
