import { DiskError } from './disk-error';

export class DiskUnexpectedS3Error extends DiskError {
  status = 500;

  errorCodeName = 'DISK_UNEXPECTED_S3_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DiskUnexpectedS3Error.prototype);
  }
}
