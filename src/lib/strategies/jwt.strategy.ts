import { ConfigType } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../modules/users/domain/services/users.service';
import jwtConfig from 'config/registers/jwt.config';
import { IVerifyToken } from 'src/modules/auth/domain/interfaces/verify-token.interface';
import { IUser } from 'src/modules/users/domain/interfaces/user.interface';

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
      throw new UnauthorizedException(
        'El token no es válido, inicie sesión para continuar',
      );
    }
    user.password = undefined; //No convertir a modelo para no perder relaciones extra
    return user;
  }
}
