import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoreModule } from 'src/core/core.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { LoginNotUsedConstraint } from './validators/login-not-used';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CoreModule],
  controllers: [UsersController],
  providers: [UsersService, LoginNotUsedConstraint],
})
export class UsersModule {}
