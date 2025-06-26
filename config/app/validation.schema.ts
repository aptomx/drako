import { APP_NAME, APP_PORT, APP_URL } from 'config/magicVariables';
import { z } from 'zod';

export const envRules = {
  [APP_NAME]: z.string().min(1, 'App name is required'),
  [APP_PORT]: z.coerce
    .number()
    .min(1, 'Port must be positive')
    .max(65535, 'Port must be valid'),
  [APP_URL]: z.string().url('Must be a valid URL'),
};
