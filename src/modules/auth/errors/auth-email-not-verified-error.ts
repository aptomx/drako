import { AuthError } from './auth-error';

export class AuthEmailNotVerifiedError extends AuthError {
  status = 403;

  errorCodeName = 'AUTH_EMAIL_NOT_VERIFIED_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthEmailNotVerifiedError.prototype);
  }
}
