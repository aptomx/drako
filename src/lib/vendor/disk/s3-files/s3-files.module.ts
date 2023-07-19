import { Module } from '@nestjs/common';
import { S3FilesService } from './s3-files.service';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import {
  S3_ACCESS_KEY_ID,
  S3_REGION,
  S3_SECRET_ACCESS_KEY,
} from 'config/magicVariables';

@Module({
  providers: [
    {
      provide: 'S3_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new S3Client({
          region: configService.get(S3_REGION),
          credentials: {
            accessKeyId: configService.get(S3_ACCESS_KEY_ID),
            secretAccessKey: configService.get(S3_SECRET_ACCESS_KEY),
          },
        });
      },
      inject: [ConfigService],
    },
    S3FilesService,
  ],
  exports: ['S3_CLIENT'],
})
export class S3FilesModule {}
