import { Module } from '@nestjs/common';
import { DiskModule } from 'src/lib/vendor/disk/disk.module';
import { MailModule } from 'src/lib/vendor/mail/mail.module';
import { ResizeImagesModule } from 'src/lib/vendor/resize-images/resize-images.module';
import { BasicController } from './basic.controller';
import { BasicService } from './basic.service';

@Module({
  providers: [BasicService],
  controllers: [BasicController],
  imports: [DiskModule, ResizeImagesModule, MailModule],
})
export class BasicModule {}
