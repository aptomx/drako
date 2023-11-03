import * as Joi from 'joi';
import { APPLE_CLIENT_ID } from 'config/magicVariables';

export const envRules = {
  [APPLE_CLIENT_ID]: Joi.string().optional().default(''),
};
