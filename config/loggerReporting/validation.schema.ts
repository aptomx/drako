import { SENTRY_DNS, SENTRY_ENVIRONMENT } from 'config/magicVariables';
import { z } from 'zod';

export const envRules = {
  [SENTRY_DNS]: z.string().min(1),
  [SENTRY_ENVIRONMENT]: z.string().min(1),
};
