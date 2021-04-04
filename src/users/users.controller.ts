import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneParams } from './params/find-one';
import { UpdateParams } from './params/update';
import { RemoveParams } from './params/remove';
import { FindAllParams } from './params/find-all';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() { loginSubstring, limit }: FindAllParams) {
    return this.usersService.findAll(loginSubstring, limit);
  }

  @Get(':id')
  findOne(@Param() { id }: FindOneParams) {
    const user = this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`user with id (${id}) not found`);
    }
    return user;
  }

  @Patch(':id')
  async update(@Param() { id }: UpdateParams, @Body() updateUserDto: UpdateUserDto) {
    const { login } = updateUserDto;
    if (login) {
      if (await this.usersService.findOneByLogin(login, id)) {
        throw new BadRequestException(`login (${login}) is already used by another user`);
      }
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param() { id }: RemoveParams) {
    return this.usersService.remove(id);
  }
}
