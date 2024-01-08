import { AuthError } from './auth-error';

export class AuthInactiveAccountError extends AuthError {
  status = 403;

  errorCodeName = 'AUTH_INACTIVE_ACCOUNT_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthInactiveAccountError.prototype);
  }
}
