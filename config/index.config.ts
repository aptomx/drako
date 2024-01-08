import * as Joi from 'joi';
import appEnvRules from './app';
import mailEnvRules from './mail';
import filesystemEnvRules from './filesystem';
import jwtEnvRules from './jwt';
import appleEnvRules from './apple';
import loggerReportingEnvRules from './loggerReporting';

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
  //*LOGGER REPORTING
  //***************************************
  ...loggerReportingEnvRules.envRules,
});
export default validationSchema;
