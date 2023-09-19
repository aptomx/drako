import {
  BadRequestException,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (info?.message == 'Missing credentials') {
      throw new BadRequestException(
        'Los campos de correo electrónico y contraseña son obligatorios',
      );
    }

    if (err) {
      throw new BadRequestException(err);
    }

    if (!user) {
      throw new BadRequestException(
        'Sin autorización, inicie sesión nuevamente',
      );
    }

    if (!user.isActive) {
      throw new BadRequestException(
        'Su cuenta está inactiva, comuníquese con soporte para obtener más información',
      );
    }

    if (!user.emailVerified) {
      throw new BadRequestException(
        'La cuenta de correo electrónico no ha sido verificada. Por favor revise su bandeja de entrada',
      );
    }

    return user;
  }
}
