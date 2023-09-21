import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthMissingCredentialsError } from '../../modules/auth/errors/auth-missing-credentials-error';
import { AuthError } from '../../modules/auth/errors/auth-error';
import { AuthUnauthorizedError } from '../../modules/auth/errors/auth-unauthorized-error';
import { AuthInactiveAccountError } from '../../modules/auth/errors/auth-inactive-account-error';
import { AuthEmailNotVerifiedError } from '../../modules/auth/errors/auth-email-not-verified-error';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info?.message == 'Missing credentials') {
      throw new AuthMissingCredentialsError(
        'Los campos de correo electrónico y contraseña son obligatorios',
      );
    }

    if (err) {
      throw new AuthError('Ocurrio un error inesperado al iniciar sesión', err);
    }

    if (!user) {
      throw new AuthUnauthorizedError(
        'Sin autorización, inicie sesión nuevamente',
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
