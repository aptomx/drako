import * as Joi from 'joi';
import {
  DISK_CONFIG,
  S3_ACCESS_KEY_ID,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
  S3_SIGNED_URL_EXPIRATION,
} from 'config/magicVariables';
import { DiskConfig } from 'config/enums/disk.enum';

export const envRules = {
  [DISK_CONFIG]: Joi.string()
    .allow('')
    .valid(DiskConfig.local, DiskConfig.s3)
    .default(''),
  [S3_BUCKET_NAME]: Joi.when(DISK_CONFIG, {
    is: DiskConfig.s3,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [S3_ACCESS_KEY_ID]: Joi.when(DISK_CONFIG, {
    is: DiskConfig.s3,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [S3_SECRET_ACCESS_KEY]: Joi.when(DISK_CONFIG, {
    is: DiskConfig.s3,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [S3_REGION]: Joi.when(DISK_CONFIG, {
    is: DiskConfig.s3,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  [S3_SIGNED_URL_EXPIRATION]: Joi.when(DISK_CONFIG, {
    is: DiskConfig.s3,
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
};
