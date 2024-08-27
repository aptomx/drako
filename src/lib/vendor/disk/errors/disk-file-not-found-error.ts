import { DiskError } from './disk-error';

export class DiskFileNotFoundError extends DiskError {
  status = 404;

  errorCodeName = 'DISK_FILE_NOT_FOUND_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, DiskFileNotFoundError.prototype);
  }
}
