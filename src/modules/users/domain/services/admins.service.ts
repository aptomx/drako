import { Inject, Injectable } from '@nestjs/common';
import { IUsersDatabaseRepository } from '../repositories/users.interface';
import { IUser } from '../interfaces/user.interface';
import { CreateAdminUserCommand } from '../../infrastructure/commands/admin/create-admin-user.command';
import { UserModel } from '../models/user.model';
import {
  getRandomAlphanumeric,
  getRandomNumeric,
} from 'src/lib/utils/ramdom-string';
import * as bcrypt from 'bcrypt';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { UpdateAdminUserCommand } from '../../infrastructure/commands/admin/update-admin-user.command';
import { IAdminsDatabaseRepository } from '../repositories/admins.interface';
import { FindAdminUsersCommand } from '../../infrastructure/commands/admin/find-admin-users.command';
import { IPagination } from 'src/lib/interfaces/pagination.interface';
import { UsersService } from './users.service';
import { ERROR_USER_EXIST } from 'config/messageResponses';
import { DiskService } from 'src/lib/vendor/disk/disk.service';
import { AuthService } from 'src/modules/auth/domain/services/auth.service';
import { MailService } from 'src/lib/vendor/mail/mail.service';
import { RecoveryCodeModel } from 'src/modules/auth/domain/models/recovery-code.model';
import { RecoveryCodeTypes } from 'src/modules/auth/domain/enums/recovery-code.enum';
import { UserAlreadyExistsError } from '../../errors/user-already-exists-error';

@Injectable()
export class AdminsService {
  constructor(
    @Inject(IUsersDatabaseRepository)
    private readonly usersDatabaseRepository: IUsersDatabaseRepository,
    @Inject(IAdminsDatabaseRepository)
    private readonly adminDatabaseRepository: IAdminsDatabaseRepository,
    private usersService: UsersService,
    private diskService: DiskService,
    private readonly authService: AuthService,
    private readonly mailService: MailService,
  ) {}

  async findAll(
    query: FindAdminUsersCommand,
  ): Promise<IUser[] | IPagination<IUser>> {
    return await this.adminDatabaseRepository.findAll(query);
  }

  async create(data: CreateAdminUserCommand): Promise<IUser> {
    const existingUser = await this.usersService.findOneByEmail(data.email);

    if (existingUser) {
      throw new UserAlreadyExistsError(
        'Ya existe un usuario registrado con el mismo email',
      );
    }

    const password = getRandomAlphanumeric();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel(data.email, data.firstName, data.lastName);
    newUser.password = hashedPassword;
    newUser.phone = data.phone;

    const adminRole = await this.usersService.findRole(UserRoles.Admin);

    const createdUser = await this.adminDatabaseRepository.create(
      newUser,
      adminRole.id,
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
      'welcomeAdmin',
      [createdUser.email],
      {
        name: createdUser.fullName,
        password,
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
    //TODO:Añadir modulos
    createdUserM.hidePassword();

    return createdUserM as IUser;
  }

  async update(id: number, data: UpdateAdminUserCommand): Promise<IUser> {
    const existingUser = await this.usersService.findOne(id);

    const verifyEmail = await this.usersDatabaseRepository.findOneByEmailNotId(
      existingUser.id,
      data.email,
    );
    if (verifyEmail) throw new UserAlreadyExistsError(ERROR_USER_EXIST);

    let existingUserM = this.parseEntityToModel(existingUser);
    if (data.email != existingUserM.email) {
      existingUserM = await this.usersService.updateEmailVerified(
        existingUser.id,
        false,
      );
      const code = getRandomNumeric(6);
      const token = await this.authService.generateTokenByUser(existingUserM);
      const recoveryCode = new RecoveryCodeModel(
        code,
        token,
        RecoveryCodeTypes.verifyEmail,
        existingUserM.id,
      );
      await this.authService.createRecoveryCode(recoveryCode);
      await this.mailService.sendMail(
        'verifyEmail',
        [existingUserM.email],
        {
          name: existingUserM.fullName,
          code: code,
        },
        'Verifica tu email',
      );
    }
    //TODO:Añadir modulos
    existingUserM.updateUserAdmin(
      data.email,
      data.firstName,
      data.lastName,
      data.phone,
    );
    await this.adminDatabaseRepository.update(existingUser.id, existingUserM);
    existingUserM.hidePassword();

    return existingUserM as IUser;
  }

  async delete(id: number): Promise<void> {
    await this.usersService.findOne(id);
    await this.adminDatabaseRepository.delete(id);
  }

  async updatePicture(id: number, file: Express.Multer.File): Promise<IUser> {
    const existingUser = await this.usersService.findOne(id);
    const existingUserM = this.parseEntityToModel(existingUser);

    const result = await this.diskService.uploadDisk(file, 'userPicture');

    existingUserM.updateUserPicture(result.url);
    await this.adminDatabaseRepository.update(id, existingUserM);

    existingUserM.hidePassword();

    return existingUserM as IUser;
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
