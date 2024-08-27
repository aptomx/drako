export abstract class BaseError extends Error {
  abstract status: number;

  abstract errorCodeName: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: any;

  isReportable?: boolean;

  protected constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}
