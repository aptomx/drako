import { MailError } from './mail-error';

export class MailTemplateNotFoundError extends MailError {
  status = 404;

  errorCodeName = 'MAIL_TEMPLATE_NOT_FOUND_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, MailTemplateNotFoundError.prototype);
  }
}
