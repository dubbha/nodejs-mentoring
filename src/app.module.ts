import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as helmet from 'helmet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { HttpLogger } from './core/middlewares';

@Module({
  imports: [TypeOrmModule.forRoot(), CoreModule, UsersModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(helmet());
    consumer.apply(HttpLogger).forRoutes('*');
  }
}
