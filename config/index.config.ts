import * as Joi from 'joi';
import { envRules as appEnvRules } from './app/validation.schema';
import { envRules as mailEnvRules } from './mail/validation.schema';
import { envRules as filesystemEnvRules } from './filesystem/validation.schema';

const validationSchema = Joi.object({
  //***************************************
  //*APP
  //***************************************
  ...appEnvRules,
  //***************************************
  //*MAIL
  //***************************************
  ...mailEnvRules,
  //***************************************
  //*FILESYSTEM
  //***************************************
  ...filesystemEnvRules,
});
export default validationSchema;
