import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { IPagination } from '../../../../lib/interfaces/pagination.interface';
import { FindAdminUsersCommand } from '../../infrastructure/commands/admin/find-admin-users.command';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { UserEntity } from '../../infrastructure/entities/user.entity';
import { IModule } from '../interfaces/module.interface';
import { ModulePermissionsModel } from '../models/module-permissions.model';

export interface IAdminsDatabaseRepository {
  findAll(query: FindAdminUsersCommand): Promise<IUser[] | IPagination<IUser>>;
  create(
    data: UserModel,
    roleId: UserRoles,
    permissions: ModulePermissionsModel[],
  ): Promise<UserModel>;
  update(
    id: number,
    data: UserModel,
    permissions?: ModulePermissionsModel[],
  ): Promise<UserModel>;
  delete(id: number): Promise<void>;
  findOneModulePermission(id: number): Promise<IModule>;
  parseEntityToModel(data: UserEntity | IUser): UserModel;
}

export const IAdminsDatabaseRepository = Symbol('IAdminsDatabaseRepository');
