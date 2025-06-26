import { DiskError } from './disk-error';

export class DiskFileNotFoundError extends DiskError {
  status = 404;

  errorCodeName = 'DISK_FILE_NOT_FOUND_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, DiskFileNotFoundError.prototype);
  }
}
