import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import dataSource from '../../../../config/database/connectors/typeorm.connector';
import { AuthLogsEntity } from '../../../modules/auth/infrastructure/entities/auth-logs.entity';
import { IAuthLogMessage } from './interfaces/auth-log-message.interface';

@Injectable()
export class LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console(),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxFiles: '30d',
          maxSize: '20m',
          dirname: 'logs',
          level: 'error',
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.log('info', message);
  }

  error(message: string, trace?: string) {
    this.logger.error(message, trace);
  }

  async login(message: IAuthLogMessage) {
    this.logger.log('info', message);

    try {
      await dataSource.getRepository(AuthLogsEntity).save(message);
    } catch (error) {
      console.log(error);
    }
  }
}
