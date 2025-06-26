import { DiskError } from './disk-error';

export class DiskFileTooLargeError extends DiskError {
  status = 413;

  errorCodeName = 'DISK_FILE_TOO_LARGE_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, DiskFileTooLargeError.prototype);
  }
}
