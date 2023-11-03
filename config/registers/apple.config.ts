import { registerAs } from '@nestjs/config';
import { APPLE_CLIENT_ID } from '../magicVariables';

export default registerAs('apple', () => ({
  appleClientId: process.env[APPLE_CLIENT_ID],
}));
