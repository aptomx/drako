import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { Drivers } from 'config/enums/database-driver.enum';
import { MIGRATION_SRC } from 'config/constants';

dotenv.config({ path: '.env' });

const driver = process.env.DATABASE_TYPE;
if (!Drivers[driver]) {
  throw new Error('Database: Driver not valid');
}
export const dataSourceOptions: DataSourceOptions = {
  type: Drivers[driver],
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  synchronize: false, //never use true
  migrationsTableName: 'migrations',
  entities: ['dist/**/*.entity.{ts,js}'],
  migrations: [`dist/${MIGRATION_SRC}/*.{ts,js}`],
};
const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
