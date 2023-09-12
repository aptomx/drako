import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../../users/domain/services/users.service';
import { UserModel } from '../../../users/domain/models/user.model';
import { IAuthDatabaseRepository } from '../repositories/auth.interface';
import { MailService } from '../../../../lib/vendor/mail/mail.service';
import { getRandomNumeric } from 'src/lib/utils/ramdom-string';
import { RecoveryCodeModel } from '../models/recovery-code.model';
import { RecoveryCodeTypes } from '../enums/recovery-code.enum';
import jwtConfig from 'config/registers/jwt.config';
import { ConfigType } from '@nestjs/config';
import { VerifyAccountCommand } from '../../infrastructure/commands/verify-account.command';
import { IVerifyToken } from '../interfaces/verify-token.interface';
import { RecoveryCodeEntity } from '../../infrastructure/entities/recovery-code.entity';
import { IRecoveryCode } from '../interfaces/recovery-code.interface';
import { VerifyRecoveryPasswordCommand } from '../../infrastructure/commands/verify-recovery-password.command';
import { UpdateRecoveryPasswordCommand } from '../../infrastructure/commands/update-recovery-password.command';
import { IUser } from 'src/modules/users/domain/interfaces/user.interface';

@Injectable()
export class AuthService {
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
      throw new NotFoundException('Usuario no encontrado');
    }

    if (!user.password) {
      throw new UnauthorizedException(
        'El usuario no cuenta con una contraseña asignada',
      );
    }

    const isPasswordMatching = await bcrypt.compare(pass, user.password);

    if (!isPasswordMatching) {
      throw new UnauthorizedException('La contraseña no coincide');
    }
    return user;
  }

  async generateTokenByUser(user: UserModel): Promise<string> {
    const payload = { email: user.email, sub: user.uuid, id: user.id };
    return this.jwtService.sign(payload);
  }

  async signTokenToRecoverPassword(user: UserModel) {
    const payload = { email: user.email, sub: user.uuid, id: user.id };
    const token = await this.jwtService.sign(payload, {
      expiresIn: this.config.jwtExpirationTimeRecoverPassword,
    });
    return token;
  }

  async checkTokenJWT(token: string): Promise<IVerifyToken> {
    try {
      return await this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('El token es inválido');
    }
  }

  parseEntityToModel(
    data: RecoveryCodeEntity | IRecoveryCode,
  ): RecoveryCodeModel {
    return this.authDatabaseRepository.parseEntityToModel(data);
  }

  async updateRecoveryCodeToken(
    data: RecoveryCodeModel,
    token: string,
  ): Promise<RecoveryCodeModel> {
    data.updateToken(token);
    if (!data.id) {
      throw new BadRequestException('El id es requerido para actualizar');
    }
    return await this.authDatabaseRepository.updateRecoveryCode(data.id, data);
  }

  async createRecoveryCode(
    code: RecoveryCodeModel,
  ): Promise<RecoveryCodeModel> {
    return await this.authDatabaseRepository.createRecoveryCode(code);
  }

  async sendRecoveryPasswordCode(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);

    if (!user) {
      throw new BadRequestException('El usuario no existe');
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

  async verifyEmailAccount(data: VerifyAccountCommand): Promise<UserModel> {
    const { email, code } = data;
    const exitingCode = await this.authDatabaseRepository.findLastRecoveryCode(
      email,
      code,
      RecoveryCodeTypes.verifyEmail,
    );

    if (!exitingCode) {
      throw new BadRequestException('El código proporcionado no es válido');
    }

    try {
      await this.checkTokenJWT(exitingCode.token);
    } catch (error) {
      throw new UnauthorizedException(
        'El código para verificar la cuenta es inválido o ha expirado',
      );
    }
    const user = await this.usersService.findOne(exitingCode.userId);
    if (user.emailVerified) {
      throw new ConflictException('La cuenta ya se encuentra verificada');
    }
    const exitingCodeMo = this.parseEntityToModel(exitingCode);
    await this.updateRecoveryCodeToken(exitingCodeMo, null);

    const updatedUser = await this.usersService.updateEmailVerified(
      user.id,
      true,
    );
    return updatedUser;
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
      throw new BadRequestException('El código proporcionado no es válido');
    }

    try {
      await this.checkTokenJWT(exitingCode.token);
    } catch (error) {
      throw new UnauthorizedException(
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
      throw new ConflictException(
        'No cuenta con una solicitud de cambio de contraseña',
      );
    }

    try {
      await this.checkTokenJWT(exitingCode.token);
    } catch (error) {
      throw new UnauthorizedException(
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
}
