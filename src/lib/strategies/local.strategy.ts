import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/modules/auth/domain/services/auth.service';
import { IUser } from 'src/modules/users/domain/interfaces/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<IUser> {
    const emailLower = email.trim().toLowerCase();
    const user = await this.authService.validateUser(emailLower, password); //No convertir a modelo para no perder relaciones extra
    user.password = undefined;
    return user;
  }
}
