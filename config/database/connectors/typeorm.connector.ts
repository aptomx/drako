import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Drivers } from 'config/enums/database-driver.enum';
import { ENTITIES_SRC, MIGRATION_SRC, SEEDS_SRC } from 'config/constants';
import { SeederOptions } from 'typeorm-extension';
import { DatabaseInvalidDriverError } from '../errors/database-invalid-driver-error';

dotenv.config({ path: '.env' });

const driver = process.env.DATABASE_TYPE;
if (!Drivers[driver]) {
  throw new DatabaseInvalidDriverError('Database: Driver not valid');
}
export const dataSourceOptions: DataSourceOptions & SeederOptions = {
  type: Drivers[driver],
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  synchronize: false, //never use true
  migrationsTableName: 'migrations',
  entities: [`${ENTITIES_SRC}/*.entity.{ts,js}`],
  migrations: [`${MIGRATION_SRC}/*.{ts,js}`],
  seeds: [`${SEEDS_SRC}/*.{ts,js}`],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
