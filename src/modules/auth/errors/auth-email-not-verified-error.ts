import { AuthError } from './auth-error';

export class AuthEmailNotVerifiedError extends AuthError {
  status = 403;

  errorCodeName = 'AUTH_EMAIL_NOT_VERIFIED_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthEmailNotVerifiedError.prototype);
  }
}
