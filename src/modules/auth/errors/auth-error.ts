import { BaseError } from '../../../lib/abstracts/base-error';

export class AuthError extends BaseError {
  status = 500;

  errorCodeName = 'AUTH_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, AuthError.prototype);
  }
}
