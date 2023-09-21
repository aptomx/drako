import { UserError } from './user-error';

export class UserNotFoundError extends UserError {
  status = 404;

  errorCodeName = 'USER_NOT_FOUND_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, UserNotFoundError.prototype);
  }
}
