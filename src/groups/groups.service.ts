import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, getConnection } from 'typeorm';
import { EntityNotFoundError, ArgumentsError, EntityConflictError } from 'core/errors';
import { LogMethodCalls } from 'core/decorators';
import { User } from 'users/entities';
import { Group } from './entities';
import { CreateGroupDto, UpdateGroupDto, AddUsersDto } from './dto';

@Injectable()
@LogMethodCalls()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupsRepository: Repository<Group>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateGroupDto) {
    try {
      return await this.groupsRepository.save(dto);
    } catch (e) {
      // unique_violation, https://www.postgresql.org/docs/13/errcodes-appendix.html
      if (e.code === '23505') {
        throw new EntityConflictError(e.detail);
      }
      throw e;
    }
  }

  findAll() {
    return this.groupsRepository.find();
  }

  async findOne(id: string) {
    const group = await this.groupsRepository.findOne({ id });
    if (!group) {
      throw new EntityNotFoundError(`group with id (${id}) not found`);
    }
    return group;
  }

  async update(id: string, dto: UpdateGroupDto) {
    const { name } = dto;
    if (name) {
      if (await this.findOneByName(name, id)) {
        throw new EntityConflictError(`name (${name}) is already used by another group`);
      }
    }
    return this.groupsRepository.update(id, dto);
  }

  remove(id: string) {
    return this.groupsRepository.delete(id);
  }

  findOneByName(name: string, exceptId?: string): Promise<Group> {
    return this.groupsRepository.findOne({
      name,
      ...(exceptId && { id: Not(exceptId) }),
    });
  }

  async addUsers(id: string, { userIds }: AddUsersDto) {
    const group = await this.groupsRepository.findOne(id, { relations: ['users'] });
    if (!group) {
      throw new EntityNotFoundError(`group with id (${id}) not found`);
    }

    const users = (
      await Promise.all(userIds.map(async userId => await this.usersRepository.findOne(userId)))
    ).filter(Boolean);

    if (!users.length) {
      throw new ArgumentsError('all user ids are wrong');
    }

    const mergedUniqueUsers = Object.values(
      [...group.users, ...users].reduce((acc, cur) => ({ ...acc, [cur.id]: cur }), {}),
    );

    return await getConnection().transaction(async transactionalEntityManager => {
      group.users = mergedUniqueUsers as User[];
      return await transactionalEntityManager.save(group);
    });
    // We don't really need to use transactions above
    // since there's only one save(), typeorm takes care about the join table.
    // We could just do this instead:
    //
    // return this.groupsRepository.save({
    //   ...group,
    //   users: mergedUniqueUsers,
    // });
  }
}
