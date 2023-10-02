import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import * as process from 'process';

@Injectable()
export class LoggerReportingService {
  static init() {
    if (process.env.SENTRY_ENVIRONMENT === 'production') {
      Sentry.init({
        dsn: process.env.SENTRY_DNS,
      });
    } else {
      Sentry.init({ dsn: '' });
    }
  }

  static captureException(error: Error) {
    Sentry.captureException(error);
  }
}
