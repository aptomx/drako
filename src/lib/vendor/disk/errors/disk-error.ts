import { BaseError } from '../../../errors/base-error';

export class DiskError extends BaseError {
  status = 500;

  errorCodeName = 'DISK_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DiskError.prototype);
  }
}
