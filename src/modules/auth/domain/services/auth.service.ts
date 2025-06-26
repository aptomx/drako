import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import jwtConfig from 'config/registers/jwt.config';
import { getRandomNumeric } from 'src/lib/utils/ramdom-string';
import { IUser } from 'src/modules/users/domain/interfaces/user.interface';
import { MailService } from '../../../../lib/vendor/mail/mail.service';
import { UserModel } from '../../../users/domain/models/user.model';
import { UsersService } from '../../../users/domain/services/users.service';
import { UserNotFoundError } from '../../../users/errors/user-not-found-error';
import { AuthAccountAlreadyVerifiedError } from '../../errors/auth-account-already-verified-error';
import { AuthIncorrectPasswordError } from '../../errors/auth-incorrect-password-error';
import { AuthInvalidRecoveryCodeError } from '../../errors/auth-invalid-recovery-code-error';
import { AuthInvalidTokenError } from '../../errors/auth-invalid-token-error';
import { AuthMissingCredentialsError } from '../../errors/auth-missing-credentials-error';
import { AuthMissingRecoveryCodeIdError } from '../../errors/auth-missing-recovery-code-id-error';
import { AuthNoPasswordResetRequestError } from '../../errors/auth-no-password-reset-request-error';
import { UpdateRecoveryPasswordCommand } from '../../infrastructure/commands/update-recovery-password.command';
import { VerifyAccountCommand } from '../../infrastructure/commands/verify-account.command';
import { VerifyRecoveryPasswordCommand } from '../../infrastructure/commands/verify-recovery-password.command';
import { RecoveryCodeTypes } from '../enums/recovery-code.enum';
import { IRecoveryCode } from '../interfaces/recovery-code.interface';
import { IVerifyToken } from '../interfaces/verify-token.interface';
import { RecoveryCodeModel } from '../models/recovery-code.model';
import { IAuthDatabaseRepository } from '../repositories/auth.interface';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    @Inject(IAuthDatabaseRepository)
    private readonly authDatabaseRepository: IAuthDatabaseRepository,
    @Inject(jwtConfig.KEY)
    private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  async validateUser(email: string, pass: string): Promise<IUser> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UserNotFoundError('Usuario no encontrado');
    }

    if (!user.password) {
      throw new AuthMissingCredentialsError(
        'El usuario no cuenta con una contraseña asignada',
      );
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (!isPasswordMatching) {
      throw new AuthIncorrectPasswordError('La contraseña no coincide');
    }
    return user;
  }

  async generateTokenByUser(user: UserModel): Promise<string> {
    const payload = { email: user.email, sub: user.uuid, id: user.id };
    return this.jwtService.sign(payload);
  }

  signTokenToRecoverPassword(user: UserModel): string {
    const payload = { email: user.email, sub: user.uuid, id: user.id };
    return this.jwtService.sign(payload, {
      expiresIn: this.config.jwtExpirationTimeRecoverPassword,
    });
  }

  async checkTokenJWT(token: string): Promise<IVerifyToken> {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      this.logger.error('JWT token verification failed', error?.stack);
      throw new AuthInvalidTokenError('El token es inválido');
    }
  }

  async updateRecoveryCodeToken(
    data: RecoveryCodeModel,
    token: string,
  ): Promise<IRecoveryCode> {
    data.updateToken(token);
    if (!data.id) {
      throw new AuthMissingRecoveryCodeIdError(
        'El id es requerido para actualizar',
      );
    }
    return await this.authDatabaseRepository.updateRecoveryCode(data.id, data);
  }

  async createRecoveryCode(code: RecoveryCodeModel): Promise<IRecoveryCode> {
    return await this.authDatabaseRepository.createRecoveryCode(code);
  }

  async sendRecoveryPasswordCode(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new UserNotFoundError('El usuario no existe');
    }

    const code = getRandomNumeric(6);
    const token = await this.signTokenToRecoverPassword(user);

    const recoveryCode = new RecoveryCodeModel(
      code,
      token,
      RecoveryCodeTypes.recoveryPassword,
      user.id,
    );

    await this.createRecoveryCode(recoveryCode);

    await this.mailService.sendMail(
      'recoveryPasswordCode',
      [user.email],
      {
        name: user.fullName,
        code: code,
      },
      'Solicitud de cambio de contraseña',
    );
  }

  async verifyEmailAccount(data: VerifyAccountCommand): Promise<IUser> {
    const { email, code } = data;
    const exitingCode = await this.authDatabaseRepository.findLastRecoveryCode(
      email,
      code,
      RecoveryCodeTypes.verifyEmail,
    );

    if (!exitingCode) {
      throw new AuthInvalidRecoveryCodeError(
        'El código proporcionado no es válido',
      );
    }

    try {
      await this.checkTokenJWT(exitingCode.token);
    } catch {
      throw new AuthInvalidRecoveryCodeError(
        'El código para verificar la cuenta es inválido o ha expirado',
      );
    }
    const user = await this.usersService.findOne(exitingCode.userId);
    if (user.emailVerified) {
      throw new AuthAccountAlreadyVerifiedError(
        'La cuenta ya se encuentra verificada',
      );
    }
    const exitingCodeMo = this.parseEntityToModel(exitingCode);
    await this.updateRecoveryCodeToken(exitingCodeMo, null);

    return await this.usersService.updateEmailVerified(user.id, true);
  }

  async verifyRecoveryPasswordCode(
    data: VerifyRecoveryPasswordCommand,
  ): Promise<string> {
    const { email, code } = data;
    const exitingCode = await this.authDatabaseRepository.findLastRecoveryCode(
      email,
      code,
      RecoveryCodeTypes.recoveryPassword,
    );

    if (!exitingCode) {
      throw new AuthInvalidRecoveryCodeError(
        'El código proporcionado no es válido',
      );
    }

    try {
      await this.checkTokenJWT(exitingCode.token);
    } catch {
      throw new AuthInvalidRecoveryCodeError(
        'El código para cambiar la contraseña es inválido o ha expirado',
      );
    }

    return exitingCode.token;
  }

  async updatePassword(data: UpdateRecoveryPasswordCommand): Promise<void> {
    const { token, password } = data;
    const exitingCode =
      await this.authDatabaseRepository.findRecoveryCodeByToken(token);

    if (!exitingCode) {
      throw new AuthNoPasswordResetRequestError(
        'No cuenta con una solicitud de cambio de contraseña',
      );
    }

    try {
      await this.checkTokenJWT(exitingCode.token);
    } catch {
      throw new AuthInvalidRecoveryCodeError(
        'El código para cambiar la contraseña es inválido o ha expirado',
      );
    }

    const user = await this.usersService.updatePassword(
      exitingCode.userId,
      password,
    );
    const exitingCodeMo = this.parseEntityToModel(exitingCode);
    await this.updateRecoveryCodeToken(exitingCodeMo, null);
    await this.mailService.sendMail(
      'passwordChanged',
      [user.email],
      {
        name: user.fullName,
      },
      'Contraseña actualizada correctamente',
    );
  }

  private parseEntityToModel(data: IRecoveryCode): RecoveryCodeModel {
    return new RecoveryCodeModel(
      data.code,
      data.token,
      data.type,
      data.userId,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }
}
