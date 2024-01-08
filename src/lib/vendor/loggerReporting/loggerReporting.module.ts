import { Module } from '@nestjs/common';
import { LoggerReportingService } from './loggerReporting.service';

@Module({
  providers: [LoggerReportingService],
  exports: [LoggerReportingService],
})
export class LoggerReportingModule {}
