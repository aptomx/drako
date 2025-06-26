import { MailDrivers } from 'config/enums/mail.enum';
import {
  MAIL_DRIVER,
  MAIL_FROM_ADDRESS,
  MAIL_FROM_NAME,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_TEST,
  MAIL_USERNAME,
  SES_KEY,
  SES_REGION,
  SES_SECRET,
} from 'config/magicVariables';
import { z } from 'zod';

// Base schema for individual fields
const baseEnvRules = {
  [MAIL_DRIVER]: z
    .enum([MailDrivers.ses, MailDrivers.smtp, MailDrivers.mail])
    .default(MailDrivers.mail),
  [SES_KEY]: z.string().optional(),
  [SES_SECRET]: z.string().optional(),
  [SES_REGION]: z.string().optional(),
  [MAIL_HOST]: z.string().optional(),
  [MAIL_PORT]: z.string().optional(),
  [MAIL_USERNAME]: z.string().optional(),
  [MAIL_PASSWORD]: z.string().optional(),
  [MAIL_FROM_NAME]: z.string().optional(),
  [MAIL_FROM_ADDRESS]: z.string().optional(),
  [MAIL_TEST]: z.string().optional(),
};

// Create a schema that validates the conditional logic
const mailSchema = z.object(baseEnvRules).refine(
  (data) => {
    const driver = data[MAIL_DRIVER];

    // SES specific validations
    if (driver === MailDrivers.ses) {
      return !!(
        data[SES_KEY] &&
        data[SES_SECRET] &&
        data[SES_REGION] &&
        data[MAIL_FROM_NAME] &&
        data[MAIL_FROM_ADDRESS] &&
        data[MAIL_TEST]
      );
    }

    // SMTP and Mail specific validations
    if (driver === MailDrivers.smtp || driver === MailDrivers.mail) {
      return !!(
        data[MAIL_HOST] &&
        data[MAIL_PORT] &&
        data[MAIL_USERNAME] &&
        data[MAIL_PASSWORD] &&
        data[MAIL_FROM_NAME] &&
        data[MAIL_FROM_ADDRESS] &&
        data[MAIL_TEST]
      );
    }

    return true;
  },
  {
    message: 'Mail configuration is incomplete for the selected driver',
    path: [MAIL_DRIVER],
  },
);

// Export the rules for compatibility with existing code
export const envRules = baseEnvRules;

// Export the complete schema for validation
export const envSchema = mailSchema;
