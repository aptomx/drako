import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthLogStatus } from '../../modules/auth/domain/enums/auth-log-status.enum';
import { AuthEmailNotVerifiedError } from '../../modules/auth/errors/auth-email-not-verified-error';
import { AuthError } from '../../modules/auth/errors/auth-error';
import { AuthInactiveAccountError } from '../../modules/auth/errors/auth-inactive-account-error';
import { AuthMissingCredentialsError } from '../../modules/auth/errors/auth-missing-credentials-error';
import { AuthUnauthorizedError } from '../../modules/auth/errors/auth-unauthorized-error';
import { LoggerService } from '../vendor/logger/logger.service';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  constructor(private readonly loggerService: LoggerService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async handleRequest(err, user, info, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const { ip, headers, body } = request;

    let error: AuthError = null;

    if (info?.message == 'Missing credentials') {
      error = new AuthMissingCredentialsError(
        'Los campos de correo electrónico y contraseña son obligatorios',
      );
    } else if (err) {
      error = err;
    } else if (!user) {
      error = new AuthUnauthorizedError(
        'Sin autorización, inicie sesión nuevamente',
      );
    } else if (!user.isActive) {
      error = new AuthInactiveAccountError(
        'Su cuenta está inactiva, comuníquese con soporte para obtener más información',
      );
    } else if (!user.emailVerified) {
      error = new AuthEmailNotVerifiedError(
        'La cuenta de correo electrónico no ha sido verificada. Por favor revise su bandeja de entrada',
      );
    }

    const authLog = {
      ip,
      userAgent: headers['user-agent'],
      email: body?.email || null,
      status: error ? AuthLogStatus.failed : AuthLogStatus.success,
      error: error?.message || null,
    };

    await this.loggerService.login(authLog);

    if (error) {
      throw error;
    }

    return user;
  }
}
