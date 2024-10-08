import { registerAs } from '@nestjs/config';
import {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_PASSWORD,
  DATABASE_NAME,
  DATABASE_DIALECT,
} from '../magicVariables';

export default registerAs('database', () => ({
  databaseHost: process.env[DATABASE_HOST],
  databasePort: process.env[DATABASE_PORT],
  databaseUser: process.env[DATABASE_USER],
  databasePassword: process.env[DATABASE_PASSWORD],
  databaseName: process.env[DATABASE_NAME],
  databaseDialect: process.env[DATABASE_DIALECT],
}));
