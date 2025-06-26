import { registerAs } from '@nestjs/config';
import {
  DATABASE_DIALECT,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from '../magicVariables';

export default registerAs('database', () => ({
  databaseHost: process.env[DATABASE_HOST],
  databasePort: process.env[DATABASE_PORT],
  databaseUser: process.env[DATABASE_USER],
  databasePassword: process.env[DATABASE_PASSWORD],
  databaseName: process.env[DATABASE_NAME],
  databaseDialect: process.env[DATABASE_DIALECT],
}));
