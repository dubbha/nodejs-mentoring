import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsEnum } from 'class-validator';
import { Permission } from '../enums';

export class CreateGroupDto {
  @ApiProperty({ description: 'Name of the group' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Array of permissions' })
  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}
