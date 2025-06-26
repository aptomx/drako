import { APPLE_CLIENT_ID } from 'config/magicVariables';
import { z } from 'zod';

export const envRules = {
  [APPLE_CLIENT_ID]: z.string().default(''),
};
