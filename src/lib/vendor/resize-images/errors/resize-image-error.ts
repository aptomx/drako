import { BaseError } from '../../../abstracts/base-error';

export class ResizeImageError extends BaseError {
  status = 500;

  errorCodeName = 'RESIZE_IMAGE_ERROR';

  // biome-ignore lint/suspicious/noExplicitAny: Error handling - details can be any type
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, ResizeImageError.prototype);
  }
}
