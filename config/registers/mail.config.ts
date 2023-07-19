import { registerAs } from '@nestjs/config';
import {
  MAIL_FROM_NAME,
  MAIL_FROM_ADDRESS,
  MAIL_TEST,
  MAIL_DRIVER,
} from '../magicVariables';

export default registerAs('mail', () => ({
  mailDriver: process.env[MAIL_DRIVER],
  mailFromName: process.env[MAIL_FROM_NAME],
  mailFromAddress: process.env[MAIL_FROM_ADDRESS],
  mailTest: process.env[MAIL_TEST],
}));
