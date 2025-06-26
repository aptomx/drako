import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthEmailNotVerifiedError } from '../../modules/auth/errors/auth-email-not-verified-error';
import { AuthInactiveAccountError } from '../../modules/auth/errors/auth-inactive-account-error';
import { AuthUnauthorizedError } from '../../modules/auth/errors/auth-unauthorized-error';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw (
        err ||
        new AuthUnauthorizedError('Sin autorización, inicie sesión nuevamente')
      );
    }

    if (!user.isActive) {
      throw new AuthInactiveAccountError(
        'Su cuenta está inactiva, comuníquese con soporte para obtener más información',
      );
    }

    if (!user.emailVerified) {
      throw new AuthEmailNotVerifiedError(
        'La cuenta de correo electrónico no ha sido verificada. Por favor revise su bandeja de entrada',
      );
    }

    return user;
  }
}
