import { Inject, Injectable } from '@nestjs/common';
import { IUsersDatabaseRepository } from '../repositories/users.interface';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { MailService } from 'src/lib/vendor/mail/mail.service';
import { UserNotFoundError } from '../../errors/user-not-found-error';
import { IRole } from '../interfaces/role.interface';
import { CreateClientUserCommand } from '../../infrastructure/commands/client/create-client-user.command';
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error';
import { getRandomNumeric } from 'src/lib/utils/ramdom-string';
import { RecoveryCodeModel } from 'src/modules/auth/domain/models/recovery-code.model';
import { AuthService } from 'src/modules/auth/domain/services/auth.service';
import { RecoveryCodeTypes } from 'src/modules/auth/domain/enums/recovery-code.enum';

@Injectable()
export class UsersService {
  constructor(
    @Inject(IUsersDatabaseRepository)
    private readonly usersDatabaseRepository: IUsersDatabaseRepository,
    private readonly mailService: MailService,
    private readonly authService: AuthService,
  ) {}

  async findOne(id: number): Promise<IUser> {
    const data: IUser = await this.usersDatabaseRepository.findOne(id);
    if (!data) {
      throw new UserNotFoundError(`El usuario con Id ${id} no existe`);
    }
    data.password = undefined;
    return data;
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    return await this.usersDatabaseRepository.findOneByEmail(email);
  }

  async findOneByEmailNotId(
    userId: number,
    email: string,
  ): Promise<IUser | null> {
    return await this.usersDatabaseRepository.findOneByEmailNotId(
      userId,
      email,
    );
  }

  async updateEmailVerified(userId: number, value: boolean): Promise<IUser> {
    const user = await this.findOne(userId);
    const userMo = await this.parseEntityToModel(user);
    userMo.updateEmailVerified(value);
    return await this.usersDatabaseRepository.update(user.id, userMo);
  }

  async updatePassword(userId: number, value: string): Promise<IUser> {
    const user = await this.findOne(userId);
    const userMo = await this.parseEntityToModel(user);
    const hashPassword = await bcrypt.hash(value, 10);
    userMo.updatePassword(hashPassword);
    return await this.usersDatabaseRepository.update(user.id, userMo);
  }

  async updateUserSocialMedia(
    userId: number,
    name: string,
    lastName: string,
    driver: string,
    token: string,
    fileUrl: string,
  ) {
    const user = await this.findOne(userId);
    const userMo = await this.parseEntityToModel(user);
    userMo.updateBySocialNetwork(name, lastName, driver, token);
    userMo.updateUserPicture(fileUrl);
    return await this.usersDatabaseRepository.update(user.id, userMo);
  }

  async createUserSocialMedia(
    email: string,
    firstName: string,
    lastName: string,
    driver: string,
    token: string,
    fileUrl: string,
  ): Promise<UserModel> {
    const newUser = new UserModel(email, firstName, lastName);
    newUser.isActive = true;
    newUser.emailVerified = true;
    newUser.photo = fileUrl;
    newUser.driver = driver;
    newUser.token = token;

    const createdUser = await this.usersDatabaseRepository.create(
      newUser,
      UserRoles.Client,
    );

    await this.mailService.sendMail(
      'welcomeSocialNetwork',
      [newUser.email],
      {
        name: newUser.fullName,
      },
      'Bienvenido',
    );
    const createdUserM = this.parseEntityToModel(createdUser);
    createdUserM.hidePassword();

    return createdUserM as IUser;
  }

  async createUserNormal(data: CreateClientUserCommand): Promise<IUser> {
    const existingUser = await this.findOneByEmail(data.email);

    if (existingUser) {
      throw new UserAlreadyExistsError(
        'Ya existe un usuario registrado con el mismo email',
      );
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new UserModel(data.email, data.firstName, data.lastName);
    newUser.password = hashedPassword;
    newUser.isActive = true;
    newUser.emailVerified = false;

    const createdUser = await this.usersDatabaseRepository.create(
      newUser,
      UserRoles.Client,
    );

    const code = getRandomNumeric(6);
    const token = await this.authService.generateTokenByUser(createdUser);
    const recoveryCode = new RecoveryCodeModel(
      code,
      token,
      RecoveryCodeTypes.verifyEmail,
      createdUser.id,
    );
    await this.authService.createRecoveryCode(recoveryCode);

    await this.mailService.sendMail(
      'welcomeClient',
      [createdUser.email],
      {
        name: createdUser.fullName,
      },
      'Bienvenido',
    );

    await this.mailService.sendMail(
      'verifyEmail',
      [createdUser.email],
      {
        name: createdUser.fullName,
        code: code,
      },
      'Verifica tu email',
    );

    const createdUserM = this.parseEntityToModel(createdUser);
    createdUserM.hidePassword();

    return createdUserM as IUser;
  }

  async findRole(roleName: string): Promise<IRole> {
    return await this.usersDatabaseRepository.findRole(roleName);
  }

  private parseEntityToModel(data: IUser): UserModel {
    return new UserModel(
      data.email,
      data.firstName,
      data.lastName,
      data.isActive,
      data.emailVerified,
      data.password,
      data.photo,
      data.phone,
      data.driver,
      data.token,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }
}
