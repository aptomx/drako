import * as Joi from 'joi';
import {
  DATABASE_HOST,
  DATABASE_NAME,
  DATABASE_PASSWORD,
  DATABASE_PORT,
  DATABASE_USER,
  DATABASE_DIALECT,
} from 'config/magicVariables';

export const envRules = {
  [DATABASE_HOST]: Joi.string().required(),
  [DATABASE_PORT]: Joi.string().required(),
  [DATABASE_USER]: Joi.string().required(),
  [DATABASE_PASSWORD]: Joi.string().required(),
  [DATABASE_NAME]: Joi.string().required(),
  [DATABASE_DIALECT]: Joi.string().required(),
};
