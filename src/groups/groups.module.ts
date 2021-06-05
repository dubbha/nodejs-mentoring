import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core.module';
import { User } from 'src/users/entities';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { Group } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([Group, User]), CoreModule],
  providers: [GroupsService],
  controllers: [GroupsController],
})
export class GroupsModule {}
