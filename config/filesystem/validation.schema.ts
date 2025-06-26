import { DiskConfig } from 'config/enums/disk.enum';
import {
  DISK_CONFIG,
  S3_ACCESS_KEY_ID,
  S3_BUCKET_NAME,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
  S3_SIGNED_URL_EXPIRATION,
} from 'config/magicVariables';
import { z } from 'zod';

// Base schema for individual fields
const baseEnvRules = {
  [DISK_CONFIG]: z
    .enum([DiskConfig.local, DiskConfig.s3])
    .default(DiskConfig.local),
  [S3_BUCKET_NAME]: z.string().optional(),
  [S3_ACCESS_KEY_ID]: z.string().optional(),
  [S3_SECRET_ACCESS_KEY]: z.string().optional(),
  [S3_REGION]: z.string().optional(),
  [S3_SIGNED_URL_EXPIRATION]: z.string().optional(),
};

// Create a schema that validates the conditional logic
const filesystemSchema = z.object(baseEnvRules).refine(
  (data) => {
    // If DISK_CONFIG is 's3', then all S3 fields are required
    if (data[DISK_CONFIG] === DiskConfig.s3) {
      return !!(
        data[S3_BUCKET_NAME] &&
        data[S3_ACCESS_KEY_ID] &&
        data[S3_SECRET_ACCESS_KEY] &&
        data[S3_REGION] &&
        data[S3_SIGNED_URL_EXPIRATION]
      );
    }
    return true;
  },
  {
    message:
      "When DISK_CONFIG is 's3', all S3 configuration fields are required",
    path: [DISK_CONFIG],
  },
);

// Export the rules for compatibility with existing code
export const envRules = baseEnvRules;

// Export the complete schema for validation
export const envSchema = filesystemSchema;
