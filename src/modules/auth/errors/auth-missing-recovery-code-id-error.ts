import { AuthError } from './auth-error';

export class AuthMissingRecoveryCodeIdError extends AuthError {
  status = 400;

  errorCodeName = 'AUTH_MISSING_RECOVERY_CODE_ID_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthMissingRecoveryCodeIdError.prototype);
  }
}
