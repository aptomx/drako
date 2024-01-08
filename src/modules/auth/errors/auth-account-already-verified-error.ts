import { AuthError } from './auth-error';

export class AuthAccountAlreadyVerifiedError extends AuthError {
  status = 409;

  errorCodeName = 'AUTH_ACCOUNT_ALREADY_VERIFIED_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthAccountAlreadyVerifiedError.prototype);
  }
}
