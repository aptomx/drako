import { AuthError } from './auth-error';

export class AuthInvalidRecoveryCodeError extends AuthError {
  status = 400;

  errorCodeName = 'AUTH_INVALID_RECOVERY_CODE_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthInvalidRecoveryCodeError.prototype);
  }
}
