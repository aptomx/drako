import { Module } from '@nestjs/common';
import { ResizeImagesService } from './resize-images.service';
import { DiskModule } from '../disk/disk.module';

@Module({
  providers: [ResizeImagesService],
  exports: [ResizeImagesService],
  imports: [DiskModule],
})
export class ResizeImagesModule {}
