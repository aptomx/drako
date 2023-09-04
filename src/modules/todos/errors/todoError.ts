import { BaseError } from '../../../lib/errors/baseError';

export class TodoError extends BaseError {
  status = 400;

  errorCode = 'TODO_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, TodoError.prototype);
  }
}
