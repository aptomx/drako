import { registerAs } from '@nestjs/config';
import {
  MAIL_DRIVER,
  MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME,
  MAIL_TEST,
} from '../magicVariables';

export default registerAs('mail', () => ({
  mailDriver: process.env[MAIL_DRIVER],
  mailFromName: process.env[MAIL_FROM_NAME],
  mailFromAddress: process.env[MAIL_FROM_ADDRESS],
  mailTest: process.env[MAIL_TEST],
}));
