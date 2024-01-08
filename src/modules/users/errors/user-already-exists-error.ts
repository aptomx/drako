import { UserError } from './user-error';

export class UserAlreadyExistsError extends UserError {
  status = 409;

  errorCodeName = 'USER_ALREADY_EXISTS_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}
