import { BaseError } from '../../../lib/abstracts/base-error';

export class UserError extends BaseError {
  status = 500;

  errorCodeName = 'USER_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, UserError.prototype);
  }
}
