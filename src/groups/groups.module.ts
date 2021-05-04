import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User])],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
