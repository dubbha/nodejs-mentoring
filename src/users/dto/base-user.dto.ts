import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, Max, MinLength, Validate } from 'class-validator';
import { ContainsLettersAndNumbers } from '../validators/contains-letters-and-numbers';

export class BaseUserDto {
  @ApiProperty({ description: 'Login of the user' })
  @IsString()
  @MinLength(3)
  login: string;

  @ApiProperty({ description: 'Password of the user' })
  @IsString()
  @MinLength(8)
  @Validate(ContainsLettersAndNumbers, {
    message: 'password must contain both letters and numbers',
  })
  password: string;

  @ApiProperty({ description: 'Age of the user', minimum: 4, maximum: 130 })
  @IsNumber()
  @Min(4)
  @Max(130)
  age: number;
}
