import { AuthError } from './auth-error';

export class AuthMissingCredentialsError extends AuthError {
  status = 400;

  errorCodeName = 'AUTH_MISSING_CREDENTIALS_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthMissingCredentialsError.prototype);
  }
}
