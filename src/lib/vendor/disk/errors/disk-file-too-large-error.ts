import { DiskError } from './disk-error';

export class DiskFileTooLargeError extends DiskError {
  status = 413;

  errorCodeName = 'DISK_FILE_TOO_LARGE_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, DiskFileTooLargeError.prototype);
  }
}
