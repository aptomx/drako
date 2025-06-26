import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { envRules as databaseEnvRule } from 'config/database/validation.schema';
import databaseConfig from 'config/registers/database.config';
import { createZodValidation } from 'config/utils/zod-to-joi-adapter';
import { z } from 'zod';
import { SequelizeService } from './sequelize.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
      validate: createZodValidation(
        z.object({
          //***************************************
          ...databaseEnvRule,
          //***************************************
        }),
      ),
    }),
    SequelizeModule.forRootAsync({ useClass: SequelizeService }),
  ],
})
export class DatabaseModule {}
