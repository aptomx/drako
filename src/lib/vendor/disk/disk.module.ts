import { Module } from '@nestjs/common';
import { DiskService } from './disk.service';
import { LocalFilesModule } from './storages/local-files/local-files.module';
import { LocalFilesService } from './storages/local-files/local-files.service';
import { S3FilesModule } from './storages/s3-files/s3-files.module';
import { S3FilesService } from './storages/s3-files/s3-files.service';
@Module({
  providers: [DiskService, LocalFilesService, S3FilesService],
  imports: [LocalFilesModule, S3FilesModule],
  exports: [DiskService],
})
export class DiskModule {}
