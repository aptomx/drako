import { TodoError } from './todo-error';

export class TodoCompletedDeletionError extends TodoError {
  status = 409;

  errorCodeName = 'TODO_COMPLETED_DELETION_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, TodoCompletedDeletionError.prototype);
  }
}
