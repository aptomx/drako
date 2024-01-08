import { SENTRY_DNS, SENTRY_ENVIRONMENT } from 'config/magicVariables';
import * as Joi from 'joi';

export const envRules = {
  [SENTRY_DNS]: Joi.string().required(),
  [SENTRY_ENVIRONMENT]: Joi.string().required(),
};
