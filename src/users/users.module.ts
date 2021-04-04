import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { LoginNotUsedConstraint } from './validators/login-not-used';

@Module({
  controllers: [UsersController],
  providers: [UsersService, LoginNotUsedConstraint],
})
export class UsersModule {}
