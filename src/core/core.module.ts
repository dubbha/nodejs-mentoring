import { Module } from '@nestjs/common';
import { HashService, LoggerService } from './services';

@Module({
  providers: [HashService, LoggerService],
  exports: [HashService, LoggerService],
})
export class CoreModule {}
