import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthLogsEntity } from '../../../modules/auth/infrastructure/entities/auth-logs.entity';
import { LoggerService } from './logger.service';

@Module({
  imports: [SequelizeModule.forFeature([AuthLogsEntity])],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
