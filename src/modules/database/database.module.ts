import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import databaseConfig from 'config/registers/database.config';
import * as Joi from 'joi';
import { envRules as databaseEnvRule } from 'config/database/validation.schema';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
      validationSchema: Joi.object({
        //***************************************
        ...databaseEnvRule,
        //***************************************
      }),
    }),
    SequelizeModule.forRootAsync({ useClass: DatabaseService }),
  ],
})
export class DatabaseModule {}
