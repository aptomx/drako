import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { AdminPermissionsCommand } from '../../infrastructure/commands/admin/admin-permissions.command';
import { ModulePermissionsModel } from '../models/module-permissions.model';
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
    const users = await this.adminDatabaseRepository.findAll(query);
    return users;
  }

  async create(data: CreateAdminUserCommand): Promise<UserModel> {
    const existingUser = await this.usersService.findOneByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Ya existe un usuario con este email');
    }
    const modulePermissionsModel = await this.modulePermissions(
      0,
      data.permissions,
    );

    const password = getRandomAlphanumeric();
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel(data.email, data.firstName, data.lastName);
    newUser.password = hashedPassword;
    newUser.phone = data.phone;

    const createdUser = await this.adminDatabaseRepository.create(
      newUser,
      UserRoles.Admin,
      modulePermissionsModel,
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
    return createdUser.hidePassword();
  }

  async update(id: number, data: UpdateAdminUserCommand): Promise<UserModel> {
    const existingUser = await this.usersService.findOne(id);

    const verifyEmail = await this.usersDatabaseRepository.findOneByEmailNotId(
      existingUser.id,
      data.email,
    );
    if (verifyEmail) throw new InternalServerErrorException(ERROR_USER_EXIST);

    const modulePermissionsModel = await this.modulePermissions(
      0,
      data.permissions,
    );

    let existingUserM =
      this.adminDatabaseRepository.parseEntityToModel(existingUser);
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
        [data.email],
        {
          name: existingUserM.fullName,
          code: code,
        },
        'Verifica tu email',
      );
    }

    existingUserM.updateUserAdmin(
      data.email,
      data.firstName,
      data.lastName,
      data.phone,
    );

    const updatedUser = await this.adminDatabaseRepository.update(
      existingUser.id,
      existingUserM,
      modulePermissionsModel,
    );
    return updatedUser.hidePassword();
  }

  async delete(id: number): Promise<void> {
    await this.usersService.findOne(id);
    await this.adminDatabaseRepository.delete(id);
  }

  async updatePicture(
    id: number,
    file: Express.Multer.File,
  ): Promise<UserModel> {
    const existingUser = await this.usersService.findOne(id);
    const existingUserM =
      this.adminDatabaseRepository.parseEntityToModel(existingUser);

    const result = await this.diskService.uploadDisk(file, 'userPicture');

    existingUserM.updateUserPicture(result.url);

    const updatedUser = await this.adminDatabaseRepository.update(
      id,
      existingUserM,
    );
    return updatedUser.hidePassword();
  }

  async modulePermissions(
    userId: number,
    permissions: AdminPermissionsCommand[],
  ): Promise<ModulePermissionsModel[]> {
    const modulePermissionsModel = await Promise.all(
      await permissions.map(async (module) => {
        const moduleId = parseInt(module.moduleId);
        const mod = await this.adminDatabaseRepository.findOneModulePermission(
          moduleId,
        );
        if (!mod) {
          throw new BadRequestException(
            `El módulo con ID ${moduleId} no se encontró`,
          );
        }
        const view =
          module.view === 'true' || module.view === '1' ? true : false;
        const edit =
          module.edit === 'true' || module.edit === '1' ? true : false;
        const model = new ModulePermissionsModel(userId, moduleId, view, edit);
        return model;
      }),
    );
    return modulePermissionsModel;
  }
}
