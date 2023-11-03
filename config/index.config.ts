import * as Joi from 'joi';
import appEnvRules from './app';
import mailEnvRules from './mail';
import filesystemEnvRules from './filesystem';
import jwtEnvRules from './jwt';
import appleEnvRules from './apple';

const validationSchema = Joi.object({
  //***************************************
  //*APP
  //***************************************
  ...appEnvRules.envRules,
  //***************************************
  //*MAIL
  //***************************************
  ...mailEnvRules.envRules,
  //***************************************
  //*FILESYSTEM
  //***************************************
  ...filesystemEnvRules.envRules,
  //*JWT
  //***************************************
  ...jwtEnvRules.envRules,
  //***************************************
  //*APPLE
  //***************************************
  ...appleEnvRules.envRules,
  //***************************************
});
export default validationSchema;
