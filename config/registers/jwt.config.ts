import { registerAs } from '@nestjs/config';
import {
  JWT_EXPIRATION_TIME,
  JWT_EXPIRATION_TIME_RECOVER_PASSWORD,
  JWT_SECRET_KEY,
} from 'config/magicVariables';

export default registerAs('jwt', () => ({
  jwtScretKey: process.env[JWT_SECRET_KEY],
  jwtExpirationTime: process.env[JWT_EXPIRATION_TIME],
  jwtExpirationTimeRecoverPassword:
    process.env[JWT_EXPIRATION_TIME_RECOVER_PASSWORD],
}));
