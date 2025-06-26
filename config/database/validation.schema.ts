import {
  DATABASE_DIALECT,
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
} from 'config/magicVariables';
import { z } from 'zod';

export const envRules = {
  [DATABASE_HOST]: z.string().min(1),
  [DATABASE_PORT]: z.string().min(1),
  [DATABASE_USER]: z.string().min(1),
  [DATABASE_PASSWORD]: z.string().min(1),
  [DATABASE_NAME]: z.string().min(1),
  [DATABASE_DIALECT]: z.string().min(1),
};
