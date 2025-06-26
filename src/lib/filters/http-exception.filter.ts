import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { BaseError as SequelizeError } from 'sequelize';
import { BaseError } from '../abstracts/base-error';
import {
  formatErrorCode,
  getCode,
  getErrorMessage,
} from '../utils/errors.util';
import { LoggerService } from '../vendor/logger/logger.service';
import { LoggerReportingService } from '../vendor/loggerReporting/loggerReporting.service';

@Catch() // Capture all exceptions
export class HttpFilterException implements ExceptionFilter {
  constructor(private readonly loggerService: LoggerService) {}

  // biome-ignore lint/suspicious/noExplicitAny: Exception filter must handle any exception type
  public catch(exception: any, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse();

    // biome-ignore lint/suspicious/noExplicitAny: Response format varies based on exception type
    const customResponse: any = {};
    let status: number;
    let isReportable = false;
    const exceptionStack: string = 'stack' in exception ? exception.stack : '';

    if (exception instanceof BaseError) {
      customResponse.errorCodeName = exception.errorCodeName;
      customResponse.message = exception.message;
      customResponse.details = exception.details;
      status = exception.status;
      isReportable = exception.isReportable;
    } else if (exception instanceof BadRequestException) {
      customResponse.errorCodeName = getCode(exception.getResponse());
      customResponse.message = getErrorMessage(exception.getResponse());
      status = exception.getStatus();
    } else if (exception instanceof SequelizeError) {
      customResponse.errorCodeName = formatErrorCode(exception.name);
      customResponse.message = exception.message;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      isReportable = true;
    } else {
      customResponse.errorCodeName =
        HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];
      customResponse.message = 'An unexpected error has happened';
      customResponse.details = exception.message;
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      isReportable = true;
    }

    customResponse.timestamp = new Date().toISOString();
    customResponse.stack = exceptionStack;

    this.loggerService.error(customResponse);

    if (isReportable) {
      LoggerReportingService.captureException(exception);
    }

    response.status(status).send(customResponse);
  }
}
