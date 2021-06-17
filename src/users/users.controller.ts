import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { LoggerService } from 'core/services';
import { rethrowToHttp } from 'core/errors';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { FindOneParams } from './params/find-one';
import { UpdateParams } from './params/update';
import { RemoveParams } from './params/remove';
import { FindAllParams } from './params/find-all';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private logger: LoggerService) {
    logger.setContext(this.constructor.name);
  }

  @Post()
  async create(@Body() dto: CreateUserDto) {
    try {
      return await this.usersService.create(dto);
    } catch (e) {
      this.logger.controllerMethodError(e, 'POST /', [dto]);
      rethrowToHttp(e);
    }
  }

  @Get()
  async findAll(@Query() { usernameSubstring, limit }: FindAllParams) {
    try {
      return await this.usersService.findAll(usernameSubstring, limit);
    } catch (e) {
      this.logger.controllerMethodError(e, 'GET /', [{ usernameSubstring, limit }]);
      rethrowToHttp(e);
    }
  }

  @Get(':id')
  async findOne(@Param() { id }: FindOneParams) {
    try {
      return await this.usersService.findOne(id);
    } catch (e) {
      this.logger.controllerMethodError(e, 'GET /:id', [{ id }]);
      rethrowToHttp(e);
    }
  }

  @Patch(':id')
  async update(@Param() { id }: UpdateParams, @Body() dto: UpdateUserDto) {
    try {
      return await this.usersService.update(id, dto);
    } catch (e) {
      this.logger.controllerMethodError(e, 'PATCH /:id', [{ id }, dto]);
      rethrowToHttp(e);
    }
  }

  @Delete(':id')
  async remove(@Param() { id }: RemoveParams) {
    try {
      await this.usersService.remove(id);
    } catch (e) {
      this.logger.controllerMethodError(e, 'DELETE /:id', [{ id }]);
      rethrowToHttp(e);
    }
  }
}
