import { getConnectionOptions } from 'typeorm';
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/core.module';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './groups/groups.module';
import { HttpLogger } from './core/middlewares';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true, cache: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        ({
          ...(await getConnectionOptions()),
          ...{
            host: configService.get<string>('database.host'),
            port: configService.get<number>('database.port'),
            database: configService.get<string>('database.name'),
            username: configService.get<string>('database.username'),
            password: configService.get<string>('database.password'),
          },
        } as TypeOrmModuleOptions),
    }),
    CoreModule,
    UsersModule,
    GroupsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLogger).forRoutes('*');
  }
}
