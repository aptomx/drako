import { BaseError } from '../../../src/lib/abstracts/base-error';

export class DatabaseError extends BaseError {
  status = 500;

  errorCodeName = 'DATABASE_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
