export abstract class BaseError extends Error {
  abstract status: number;

  abstract errorCodeName: string;

  // biome-ignore lint/suspicious/noExplicitAny: Base error class needs flexible details type
  details?: any;

  isReportable?: boolean;

  protected constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }
}
