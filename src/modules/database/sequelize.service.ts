import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize/dist/interfaces/sequelize-options.interface';
import { DatabaseDialects } from 'config/enums/database-dialects.enum';
import {
  DATABASE_DIALECT,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from 'config/magicVariables';
import { Dialect } from 'sequelize/types/sequelize';

@Injectable()
export class SequelizeService implements SequelizeOptionsFactory {
  getDatabaseHost(): string {
    return this.config.get<string>(DATABASE_HOST);
  }

  getDatabasePort(): number {
    return +this.config.get<number>(DATABASE_PORT);
  }

  getDatabaseUser(): string {
    return this.config.get<string>(DATABASE_USER);
  }

  getDatabasePassword(): string {
    return this.config.get<string>(DATABASE_PASSWORD);
  }

  getDatabaseName(): string {
    return this.config.get<string>(DATABASE_NAME);
  }

  getDatabaseDialect(): Dialect {
    const dialect = this.config.get<string>(DATABASE_DIALECT);
    if (!DatabaseDialects[dialect]) {
      throw new Error('Database: Dialect not valid');
    }
    return DatabaseDialects[dialect];
  }

  @Inject(ConfigService)
  private readonly config: ConfigService;

  public async createSequelizeOptions(): Promise<SequelizeModuleOptions> {
    return {
      dialect: this.getDatabaseDialect(),
      host: this.getDatabaseHost(),
      port: this.getDatabasePort(),
      username: this.getDatabaseUser(),
      password: this.getDatabasePassword(),
      database: this.getDatabaseName(),
      autoLoadModels: true,
      synchronize: false,
      logging: false,
    };
  }
}
