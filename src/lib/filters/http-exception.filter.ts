import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Response } from 'express';
import { get } from 'lodash';
import { getCode, getErrorMessage } from '../utils/errors.util';
import { DEFAULT_LIMIT_IN_MB_OF_FILES } from 'config/constants';

@Catch() // Capture all exceptions
export class HttpFilterException implements ExceptionFilter {
  // Debug logger by console exception
  private readonly logger: Logger = new Logger(HttpFilterException.name);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public catch(exception: any, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();
    let status: number;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
    } else {
      // Case of a PayloadTooLarge
      const type: string | undefined = get(exception, 'type');
      status =
        type === 'entity.too.large'
          ? HttpStatus.PAYLOAD_TOO_LARGE
          : HttpStatus.INTERNAL_SERVER_ERROR;
    }

    let code: string =
      exception instanceof HttpException
        ? getCode(exception.getResponse())
        : HttpStatus[HttpStatus.INTERNAL_SERVER_ERROR];
    let message: string =
      exception instanceof HttpException
        ? getErrorMessage(exception.getResponse())
        : exception.message
        ? exception.message
        : 'Ocurrió un error interno del servidor';

    if (status === HttpStatus.PAYLOAD_TOO_LARGE) {
      code = HttpStatus[HttpStatus.PAYLOAD_TOO_LARGE];
      message = `
            El tamaño de la entidad de su solicitud es demasiado grande para que el servidor la procese:
                - tamaño de la solicitud: ${get(exception, 'length') || 'N/A'}.
                - límite de solicitud: ${
                  get(exception, 'limit') ||
                  `${DEFAULT_LIMIT_IN_MB_OF_FILES} MB`
                }.`;
    }
    const exceptionStack: string = 'stack' in exception ? exception.stack : '';
    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({
        message: `${status} [${request.method} ${request.url}] ha arrojado un error crítico`,
        headers: request.headers,
        exceptionStack,
      });
    } else if (status >= HttpStatus.BAD_REQUEST) {
      this.logger.warn({
        message: `${status} [${request.method} ${request.url}] ha arrojado un error de cliente HTTP`,
        headers: request.headers,
        exceptionStack,
      });
    }
    response.status(status).send({
      code,
      error: message,
      status,
    });
  }
}
