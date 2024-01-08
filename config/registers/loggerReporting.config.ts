import { registerAs } from '@nestjs/config';
import { SENTRY_DNS, SENTRY_ENVIRONMENT } from 'config/magicVariables';

export default registerAs('loggerReporting', () => ({
  sentryDNS: process.env[SENTRY_DNS],
  sentryEnvironment: process.env[SENTRY_ENVIRONMENT],
}));
