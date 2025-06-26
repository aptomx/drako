import { DatabaseError } from './database-error';

export class DatabaseInvalidDriverError extends DatabaseError {
  status = 500;

  errorCodeName = 'DATABASE_INVALID_DRIVER_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DatabaseInvalidDriverError.prototype);
  }
}
