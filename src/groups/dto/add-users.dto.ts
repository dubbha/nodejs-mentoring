import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID } from 'class-validator';

export class AddUsersDto {
  @ApiProperty({ description: 'User IDs to add to the group' })
  @IsArray()
  @IsUUID(4, { each: true })
  userIds: string[];
}
