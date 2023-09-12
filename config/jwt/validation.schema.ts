import {
  JWT_EXPIRATION_TIME,
  JWT_EXPIRATION_TIME_RECOVER_PASSWORD,
  JWT_SECRET_KEY,
} from 'config/magicVariables';
import * as Joi from 'joi';

export const envRules = {
  [JWT_SECRET_KEY]: Joi.string().required(),
  [JWT_EXPIRATION_TIME]: Joi.string().required(),
  [JWT_EXPIRATION_TIME_RECOVER_PASSWORD]: Joi.string().required(),
};
