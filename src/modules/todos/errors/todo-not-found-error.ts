import { TodoError } from './todo-error';

export class TodoNotFoundError extends TodoError {
  status = 404;

  errorCodeName = 'TODO_NOT_FOUND_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, TodoNotFoundError.prototype);
  }
}
