import { BaseError } from '../../../abstracts/base-error';

export class MailError extends BaseError {
  status = 500;

  errorCodeName = 'MAIL_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, MailError.prototype);
  }
}
