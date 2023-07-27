import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { IDatabaseConfig } from 'src/lib/interfaces/database.interface';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_TYPE,
  DATABASE_USER,
} from 'config/magicVariables';
import { Drivers } from 'config/enums/database-driver.enum';
import { ENTITIES_SRC } from 'config/constants';

@Injectable()
export class TypeOrmService implements TypeOrmOptionsFactory, IDatabaseConfig {
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

  getDatabaseTypeDriver(): string {
    const driver = this.config.get<string>(DATABASE_TYPE);
    if (!Drivers[driver]) {
      throw new Error('Database: Driver not valid');
    }
    return Drivers[driver];
  }

  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const driver: any = this.getDatabaseTypeDriver(); //Use any to fix typeorm rule
    const options = {
      type: driver,
      host: this.getDatabaseHost(),
      port: this.getDatabasePort(),
      database: this.getDatabaseName(),
      username: this.getDatabaseUser(),
      password: this.getDatabasePassword(),
      entities: [`dist/${ENTITIES_SRC}/*.entity.{ts,js}`],
    };
    return options;
  }
}
