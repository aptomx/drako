import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { LocalFilesService } from './storages/local-files/local-files.service';
import { S3FilesService } from './storages/s3-files/s3-files.service';
import { LocalFilesModule } from './storages/local-files/local-files.module';
import { S3FilesModule } from './storages/s3-files/s3-files.module';
@Module({
  providers: [DiskService, LocalFilesService, S3FilesService],
  imports: [LocalFilesModule, S3FilesModule],
  exports: [DiskService],
})
export class DiskModule {}
