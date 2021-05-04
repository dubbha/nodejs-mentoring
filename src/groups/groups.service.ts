import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, getConnection } from 'typeorm';
import { EntityNotFoundError, ArgumentsError } from '../core/errors';
import { User } from '../users/entities';
import { Group } from './entities';
import { CreateGroupDto, UpdateGroupDto, AddUsersDto } from './dto';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private groupsRepository: Repository<Group>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  create(dto: CreateGroupDto) {
    return this.groupsRepository.save(dto);
  }

  findAll() {
    return this.groupsRepository.find();
  }

  findOne(id: string) {
    return this.groupsRepository.findOne({ id });
  }

  update(id: string, dto: UpdateGroupDto) {
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
