import { AuthError } from './auth-error';

export class AuthNoPasswordResetRequestError extends AuthError {
  status = 404;

  errorCodeName = 'AUTH_NO_PASSWORD_RESET_REQUEST_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, AuthNoPasswordResetRequestError.prototype);
  }
}
