import { registerAs } from '@nestjs/config';
import { DiskConfig } from 'config/enums/disk.enum';
import {
  DISK_CONFIG,
  S3_ACCESS_KEY_ID,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
  S3_SIGNED_URL_EXPIRATION,
} from '../magicVariables';

export default registerAs('filesystems', () => ({
  diskConfig: process.env[DISK_CONFIG] || DiskConfig.local,
  //Only s3 config
  s3BucketName: process.env[S3_BUCKET_NAME],
  s3accessKeyId: process.env[S3_ACCESS_KEY_ID],
  s3secretAccessKey: process.env[S3_SECRET_ACCESS_KEY],
  s3region: process.env[S3_REGION],
  s3signedUrlExpiration: process.env[S3_SIGNED_URL_EXPIRATION],
}));
