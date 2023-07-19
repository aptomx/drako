import * as Joi from 'joi';
import { APP_NAME, APP_PORT, APP_URL } from 'config/magicVariables';

export const envRules = {
  [APP_NAME]: Joi.string().required(),
  [APP_PORT]: Joi.number().required(),
  [APP_URL]: Joi.string().required(),
};
