import { UserError } from './user-error';

export class UserNotFoundError extends UserError {
  status = 404;

  errorCodeName = 'USER_NOT_FOUND_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
