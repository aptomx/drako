import { z } from 'zod';
import appEnvRules from './app';
import appleEnvRules from './apple';
import filesystemEnvRules from './filesystem';
import jwtEnvRules from './jwt';
import loggerReportingEnvRules from './loggerReporting';
import mailEnvRules from './mail';

const validationSchema = z.object({
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
