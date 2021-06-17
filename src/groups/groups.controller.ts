import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { LoggerService } from 'core/services';
import { rethrowToHttp } from 'core/errors';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto, AddUsersDto } from './dto';
import { FindOneParams, UpdateParams, RemoveParams, AddUsersParams } from './params';

@Controller('groups')
export class GroupsController {
  constructor(private groupsService: GroupsService, private logger: LoggerService) {
    logger.setContext(this.constructor.name);
  }

  @Post()
  async create(@Body() dto: CreateGroupDto) {
    try {
      return await this.groupsService.create(dto);
    } catch (e) {
      this.logger.controllerMethodError(e, 'POST /', [dto]);
      rethrowToHttp(e);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.groupsService.findAll();
    } catch (e) {
      this.logger.controllerMethodError(e, 'GET /');
      rethrowToHttp(e);
    }
  }

  @Get(':id')
  async findOne(@Param() { id }: FindOneParams) {
    try {
      return await this.groupsService.findOne(id);
    } catch (e) {
      this.logger.controllerMethodError(e, 'POST /:id', [{ id }]);
      rethrowToHttp(e);
    }
  }

  @Patch(':id')
  async update(@Param() { id }: UpdateParams, @Body() dto: UpdateGroupDto) {
    try {
      return await this.groupsService.update(id, dto);
    } catch (e) {
      this.logger.controllerMethodError(e, 'PATCH /:id', [{ id }, dto]);
      rethrowToHttp(e);
    }
  }

  @Delete(':id')
  async remove(@Param() { id }: RemoveParams) {
    try {
      await this.groupsService.remove(id);
    } catch (e) {
      this.logger.controllerMethodError(e, 'DELETE /:id', [{ id }]);
      rethrowToHttp(e);
    }
  }

  @Post(':id/add-users')
  async addUsers(@Param() { id }: AddUsersParams, @Body() dto: AddUsersDto) {
    try {
      return await this.groupsService.addUsers(id, dto);
    } catch (e) {
      this.logger.controllerMethodError(e, 'POST /:id/add-users', [{ id }, dto]);
      rethrowToHttp(e);
    }
  }
}
