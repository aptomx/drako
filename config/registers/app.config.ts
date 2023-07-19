import { registerAs } from '@nestjs/config';
import { APP_NAME, APP_PORT, APP_URL } from '../magicVariables';

export default registerAs('app', () => ({
  appName: process.env[APP_NAME],
  appPort: process.env[APP_PORT],
  appUrl: process.env[APP_URL],
}));
