import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { LocalFilesModule } from './local-files/local-files.module';
import { S3FilesModule } from './s3-files/s3-files.module';
import { LocalFilesService } from './local-files/local-files.service';
import { S3FilesService } from './s3-files/s3-files.service';
@Module({
  providers: [DiskService, LocalFilesService, S3FilesService],
  imports: [LocalFilesModule, S3FilesModule],
  exports: [DiskService],
})
export class DiskModule {}
