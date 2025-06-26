import { TodoError } from './todo-error';

export class TodoNotFoundError extends TodoError {
  status = 404;

  errorCodeName = 'TODO_NOT_FOUND_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, TodoNotFoundError.prototype);
  }
}
