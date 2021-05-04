import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { EntityNotFoundError, ArgumentsError } from '../core/errors';
import { GroupsService } from './groups.service';
import { CreateGroupDto, UpdateGroupDto, AddUsersDto } from './dto';
import { FindOneParams, UpdateParams, RemoveParams, AddUsersParams } from './params';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  async create(@Body() dto: CreateGroupDto) {
    try {
      return await this.groupsService.create(dto);
    } catch (e) {
      throw new ConflictException(e.detail);
    }
  }

  @Get()
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() { id }: FindOneParams) {
    const group = await this.groupsService.findOne(id);
    if (!group) {
      throw new NotFoundException(`group with id (${id}) not found`);
    }
    return group;
  }

  @Patch(':id')
  update(@Param() { id }: UpdateParams, @Body() dto: UpdateGroupDto) {
    const { name } = dto;
    if (name) {
      if (this.groupsService.findOneByName(name, id)) {
        throw new ConflictException(`name (${name}) is already used by another group`);
      }
    }
    return this.groupsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param() { id }: RemoveParams) {
    this.groupsService.remove(id);
  }

  @Post(':id/add-users')
  async addUsers(@Param() { id }: AddUsersParams, @Body() dto: AddUsersDto) {
    try {
      return await this.groupsService.addUsers(id, dto);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new NotFoundException(e.message);
      }
      if (e instanceof ArgumentsError) {
        throw new BadRequestException(e.message);
      }
      throw e;
    }
  }
}
