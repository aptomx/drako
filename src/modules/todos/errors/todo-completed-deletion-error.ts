import { TodoError } from './todo-error';

export class TodoCompletedDeletionError extends TodoError {
  status = 409;

  errorCodeName = 'TODO_COMPLETED_DELETION_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, TodoCompletedDeletionError.prototype);
  }
}
