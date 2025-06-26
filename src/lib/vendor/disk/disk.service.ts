import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { DiskConfig } from 'config/enums/disk.enum';
import filesystemsConfig from 'config/registers/filesystems.config';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { DiskNotImplementedMethodError } from './errors/disk-not-implemented-method-error';
import { DiskUnsupportedMethodError } from './errors/disk-unsupported-method-error';
import { IFileResponse } from './interfaces/file-response.interface';
import { DiskModel } from './models/disk.model';
import { LocalFilesService } from './storages/local-files/local-files.service';
import { S3FilesService } from './storages/s3-files/s3-files.service';

@Injectable()
export class DiskService extends DiskModel {
  constructor(
    @Inject(filesystemsConfig.KEY)
    private readonly fsConfig: ConfigType<typeof filesystemsConfig>,
    private readonly localFilesService: LocalFilesService,
    private readonly s3FilesService: S3FilesService,
  ) {
    super();
  }

  async uploadDisk(
    file: Express.Multer.File,
    path: string,
    name?: string,
    isPrivate = false,
    quality = 80,
  ): Promise<IFileResponse> {
    if (this.fsConfig.diskConfig == DiskConfig.local) {
      if (isPrivate) {
        throw new DiskUnsupportedMethodError('Unsupported method.');
      }
      return await this.localFilesService.uploadDisk(
        file,
        path,
        this,
        name,
        isPrivate,
        quality,
      );
    }
    if (this.fsConfig.diskConfig == DiskConfig.s3) {
      return await this.s3FilesService.uploadDisk(
        file,
        path,
        this,
        name,
        isPrivate,
        quality,
      );
    }
    throw new DiskNotImplementedMethodError('Method not implemented.');
  }

  async deleteDisk(url: string): Promise<IDisplayMessageSuccess> {
    if (this.fsConfig.diskConfig == DiskConfig.local) {
      return await this.localFilesService.deleteDisk(url);
    }
    if (this.fsConfig.diskConfig == DiskConfig.s3) {
      return await this.s3FilesService.deleteDisk(url);
    }
    throw new DiskNotImplementedMethodError('Method not implemented.');
  }

  async getPresignedUrl(url: string): Promise<string> {
    if (this.fsConfig.diskConfig == DiskConfig.s3) {
      return await this.s3FilesService.getPresignedUrl(url);
    }
    throw new DiskUnsupportedMethodError('Unsupported method.');
  }
}
