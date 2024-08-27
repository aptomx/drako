import { AuthError } from './auth-error';

export class AuthInvalidRecoveryCodeError extends AuthError {
  status = 400;

  errorCodeName = 'AUTH_INVALID_RECOVERY_CODE_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthInvalidRecoveryCodeError.prototype);
  }
}
