interface ErrorDetails {
  message: string;
}

export abstract class BaseError extends Error {
  abstract status: number;

  abstract errorCode: number;

  abstract errorName: string;

  details?: ErrorDetails;

  isReportable?: boolean;

  displayName?: string;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}
