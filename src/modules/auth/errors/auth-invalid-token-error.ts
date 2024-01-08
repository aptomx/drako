import { AuthError } from './auth-error';

export class AuthInvalidTokenError extends AuthError {
  status = 401;

  errorCodeName = 'AUTH_INVALID_TOKEN_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthInvalidTokenError.prototype);
  }
}
