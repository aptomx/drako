import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { AuthLogsEntity } from '../../../modules/auth/infrastructure/entities/auth-logs.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([AuthLogsEntity])],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
