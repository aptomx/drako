import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException('Sin autorización, inicie sesión nuevamente')
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Su cuenta está inactiva, comuníquese con soporte para obtener más información',
      );
    }

    if (!user.emailVerified) {
      throw new UnauthorizedException(
        'La cuenta de correo electrónico no ha sido verificada. Por favor revise su bandeja de entrada',
      );
    }

    return user;
  }
}
