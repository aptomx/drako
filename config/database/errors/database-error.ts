import { BaseError } from '../../../src/lib/abstracts/base-error';

export class DatabaseError extends BaseError {
  status = 500;

  errorCodeName = 'DATABASE_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Legacy error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DatabaseError.prototype);
  }
}
