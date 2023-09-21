import { DatabaseError } from './database-error';

export class DatabaseInvalidDriverError extends DatabaseError {
  status = 500;

  errorCodeName = 'DATABASE_INVALID_DRIVER_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DatabaseInvalidDriverError.prototype);
  }
}
