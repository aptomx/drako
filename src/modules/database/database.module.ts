import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from 'config/registers/database.config';
import * as Joi from 'joi';
import { TypeOrmService } from './typeorm.service';
import { envRules as databaseEnvRule } from 'config/database/validation.schema';
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
    TypeOrmModule.forRootAsync({ useClass: TypeOrmService }),
  ],
})
export class DatabaseModule {}
