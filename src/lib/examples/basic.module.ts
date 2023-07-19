import { Module } from '@nestjs/common';
import { BasicService } from './basic.service';
import { BasicController } from './basic.controller';
import { DiskModule } from 'src/lib/vendor/disk/disk.module';
import { ResizeImagesModule } from 'src/lib/vendor/resize-images/resize-images.module';
import { MailModule } from 'src/lib/vendor/mail/mail.module';

@Module({
  providers: [BasicService],
  controllers: [BasicController],
  imports: [DiskModule, ResizeImagesModule, MailModule],
})
export class BasicModule {}
