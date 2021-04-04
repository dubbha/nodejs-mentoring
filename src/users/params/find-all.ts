import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

export class FindAllParams {
  @ApiProperty({ description: 'Limit of the auto-suggest list length', required: false })
  @IsOptional()
  @IsNumberString()
  limit?: number;

  @ApiProperty({ description: 'Login substring to search by', required: false })
  @IsOptional()
  loginSubstring?: string;
}
