import { BaseError } from '../../../lib/errors/baseError';

export class TodoDatabaseError extends BaseError {
  status = 409;

  errorCode = 1102;

  errorName = 'TODO_DATABASE_ERROR';

  displayMessage;

  constructor(
    message: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    details?: any,
    isReportable?: boolean,
    displayMessage?: string,
  ) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;
    this.displayMessage = displayMessage;

    Object.setPrototypeOf(this, TodoDatabaseError.prototype);
  }
}
