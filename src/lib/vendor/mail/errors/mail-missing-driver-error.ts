import { MailError } from './mail-error';

export class MailMissingDriverError extends MailError {
  status = 500;

  errorCodeName = 'MAIL_MISSING_DRIVER_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, MailMissingDriverError.prototype);
  }
}
