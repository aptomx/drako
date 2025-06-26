import { MailError } from './mail-error';

export class MailTemplateNotFoundError extends MailError {
  status = 404;

  errorCodeName = 'MAIL_TEMPLATE_NOT_FOUND_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, MailTemplateNotFoundError.prototype);
  }
}
