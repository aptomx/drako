import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthLogsEntity } from '../../../modules/auth/infrastructure/entities/auth-logs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthLogsEntity])],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
