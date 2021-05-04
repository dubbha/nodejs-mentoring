import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray } from 'class-validator';
import { Permission } from '../types';

export class CreateGroupDto {
  @ApiProperty({ description: 'Name of the group' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Array of permissions' })
  @IsArray()
  permissions: Permission[];
}
