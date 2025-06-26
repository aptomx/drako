import { DiskError } from './disk-error';

export class DiskNotImplementedMethodError extends DiskError {
  status = 500;

  errorCodeName = 'DISK_NOT_IMPLEMENTED_METHOD_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, DiskNotImplementedMethodError.prototype);
  }
}
