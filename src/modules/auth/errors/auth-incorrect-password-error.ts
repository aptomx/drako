import { AuthError } from './auth-error';

export class AuthIncorrectPasswordError extends AuthError {
  status = 401;

  errorCodeName = 'AUTH_INCORRECT_PASSWORD_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthIncorrectPasswordError.prototype);
  }
}
