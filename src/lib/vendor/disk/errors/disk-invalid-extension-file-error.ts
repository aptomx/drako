import { DiskError } from './disk-error';

export class DiskInvalidExtensionFileError extends DiskError {
  status = 400;

  errorCodeName = 'DISK_INVALID_EXTENSION_FILE_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, DiskInvalidExtensionFileError.prototype);
  }
}
