import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import jwtConfig from 'config/registers/jwt.config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IVerifyToken } from 'src/modules/auth/domain/interfaces/verify-token.interface';
import { IUser } from 'src/modules/users/domain/interfaces/user.interface';
import { AuthInvalidTokenError } from '../../modules/auth/errors/auth-invalid-token-error';
import { UsersService } from '../../modules/users/domain/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    config: ConfigType<typeof jwtConfig>,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwtScretKey,
    });
  }

  async validate(payload: IVerifyToken): Promise<IUser> {
    const user = await this.usersService.findOneByEmail(payload.email);

    if (!user) {
      throw new AuthInvalidTokenError(
        'El token no es válido, inicie sesión para continuar',
      );
    }
    user.password = undefined; //No convertir a modelo para no perder relaciones extra
    return user;
  }
}
