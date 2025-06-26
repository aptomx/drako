import { BaseError } from '../../../abstracts/base-error';

export class DiskError extends BaseError {
  status = 500;

  errorCodeName = 'DISK_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DiskError.prototype);
  }
}
