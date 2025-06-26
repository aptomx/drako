import { UserError } from './user-error';

export class UserAlreadyExistsError extends UserError {
  status = 409;

  errorCodeName = 'USER_ALREADY_EXISTS_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, UserAlreadyExistsError.prototype);
  }
}
