import { DiskError } from './disk-error';

export class DiskUnsupportedMethodError extends DiskError {
  status = 500;

  errorCodeName = 'DISK_UNSUPPORTED_METHOD_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DiskUnsupportedMethodError.prototype);
  }
}
