import { AuthError } from './auth-error';

export class AuthMissingRecoveryCodeIdError extends AuthError {
  status = 400;

  errorCodeName = 'AUTH_MISSING_RECOVERY_CODE_ID_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthMissingRecoveryCodeIdError.prototype);
  }
}
