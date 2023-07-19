import * as Joi from 'joi';
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
import { MailDrivers } from 'config/enums/mail.enum';

export const envRules = {
  [MAIL_DRIVER]: Joi.string()
    .allow('')
    .valid(MailDrivers.ses, MailDrivers.smtp, MailDrivers.mail)
    .default(''),
  [SES_KEY]: Joi.when(MAIL_DRIVER, {
    is: MailDrivers.ses,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [SES_SECRET]: Joi.when(MAIL_DRIVER, {
    is: MailDrivers.ses,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [SES_REGION]: Joi.when(MAIL_DRIVER, {
    is: MailDrivers.ses,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [MAIL_HOST]: Joi.when(MAIL_DRIVER, {
    is: Joi.string().valid(MailDrivers.smtp, MailDrivers.mail),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [MAIL_PORT]: Joi.when(MAIL_DRIVER, {
    is: Joi.string().valid(MailDrivers.smtp, MailDrivers.mail),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [MAIL_USERNAME]: Joi.when(MAIL_DRIVER, {
    is: Joi.string().valid(MailDrivers.smtp, MailDrivers.mail),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [MAIL_PASSWORD]: Joi.when(MAIL_DRIVER, {
    is: Joi.string().valid(MailDrivers.smtp, MailDrivers.mail),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [MAIL_FROM_NAME]: Joi.when(MAIL_DRIVER, {
    is: Joi.string().valid(MailDrivers.smtp, MailDrivers.mail, MailDrivers.ses),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [MAIL_FROM_ADDRESS]: Joi.when(MAIL_DRIVER, {
    is: Joi.string().valid(MailDrivers.smtp, MailDrivers.mail, MailDrivers.ses),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [MAIL_TEST]: Joi.when(MAIL_DRIVER, {
    is: Joi.string().valid(MailDrivers.smtp, MailDrivers.mail, MailDrivers.ses),
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
};
