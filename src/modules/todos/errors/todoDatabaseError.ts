import { BaseError } from '../../../lib/errors/baseError';

export class TodoDatabaseError extends BaseError {
  status = 409;

  errorCode = 'TODO_DATABASE_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, TodoDatabaseError.prototype);
  }
}
