import { Injectable } from '@nestjs/common';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import { DEFAULT_LIMIT_IN_MB_OF_FILES } from 'config/constants';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      limits: {
        fileSize: DEFAULT_LIMIT_IN_MB_OF_FILES * 1000000, //In bytes [1mb = 1,000,000 bytes]
      },
    };
  }
}
