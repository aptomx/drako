import { DiskError } from './disk-error';

export class DiskUnexpectedS3Error extends DiskError {
  status = 500;

  errorCodeName = 'DISK_UNEXPECTED_S3_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DiskUnexpectedS3Error.prototype);
  }
}
