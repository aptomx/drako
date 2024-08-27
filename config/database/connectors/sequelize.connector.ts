import * as dotenv from 'dotenv';
import { DatabaseDialects } from 'config/enums/database-dialects.enum';
import { DatabaseInvalidDriverError } from '../errors/database-invalid-driver-error';
import { Sequelize } from 'sequelize-typescript';
import { AuthLogsEntity } from '../../../src/modules/auth/infrastructure/entities/auth-logs.entity';

dotenv.config({ path: '.env' });

const dialect = process.env.DATABASE_DIALECT;
if (!DatabaseDialects[dialect]) {
  throw new DatabaseInvalidDriverError('Database: Dialect not valid');
}

const sequelize = new Sequelize({
  dialect: DatabaseDialects[dialect],
  host: process.env.DATABASE_HOST,
  port: +process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  models: [AuthLogsEntity],
});

export default sequelize;
