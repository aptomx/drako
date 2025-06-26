import {
  JWT_EXPIRATION_TIME,
  JWT_EXPIRATION_TIME_RECOVER_PASSWORD,
  JWT_SECRET_KEY,
} from 'config/magicVariables';
import { z } from 'zod';

export const envRules = {
  [JWT_SECRET_KEY]: z.string().min(1),
  [JWT_EXPIRATION_TIME]: z.string().min(1),
  [JWT_EXPIRATION_TIME_RECOVER_PASSWORD]: z.string().min(1),
};
