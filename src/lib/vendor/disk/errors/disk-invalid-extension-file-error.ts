import { DiskError } from './disk-error';

export class DiskInvalidExtensionFileError extends DiskError {
  status = 400;

  errorCodeName = 'DISK_INVALID_EXTENSION_FILE_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || false;

    Object.setPrototypeOf(this, DiskInvalidExtensionFileError.prototype);
  }
}
