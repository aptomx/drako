export abstract class BaseError extends Error {
  abstract status: number;

  abstract errorCode: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;

  isReportable?: boolean;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}
