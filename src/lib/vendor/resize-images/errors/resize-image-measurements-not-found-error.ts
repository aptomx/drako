import { ResizeImageError } from './resize-image-error';

export class ResizeImageMeasurementsNotFoundError extends ResizeImageError {
  status = 404;

  errorCodeName = 'RESIZE_IMAGE_MEASUREMENTS_NOT_FOUND_ERROR';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, details?: any, isReportable?: boolean) {
    super(message);
    this.details = details;
    this.isReportable = isReportable || true;

    Object.setPrototypeOf(this, ResizeImageMeasurementsNotFoundError.prototype);
  }
}
