import { Module } from '@nestjs/common';
import { DiskModule } from '../disk/disk.module';
import { ResizeImagesService } from './resize-images.service';

@Module({
  providers: [ResizeImagesService],
  exports: [ResizeImagesService],
  imports: [DiskModule],
})
export class ResizeImagesModule {}
