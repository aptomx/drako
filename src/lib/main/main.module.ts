import { Module } from '@nestjs/common';
import { MainController } from './main.controller';
import { MainService } from './main.service';

@Module({
  providers: [MainService],
  controllers: [MainController],
})
export class MainModule {}
