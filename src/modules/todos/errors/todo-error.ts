import { BaseError } from '../../../lib/errors/base-error';

export class TodoError extends BaseError {
  status = 500;

  errorCodeName = 'TODO_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, TodoError.prototype);
  }
}
