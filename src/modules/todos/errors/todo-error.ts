import { BaseError } from '../../../lib/abstracts/base-error';

export class TodoError extends BaseError {
  status = 500;

  errorCodeName = 'TODO_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, TodoError.prototype);
  }
}
