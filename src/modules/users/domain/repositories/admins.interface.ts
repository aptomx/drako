import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { IPagination } from '../../../../lib/interfaces/pagination.interface';
import { FindAdminUsersCommand } from '../../infrastructure/commands/admin/find-admin-users.command';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { ModulePermissionsModel } from '../models/module-permissions.model';
import { IModule } from '../interfaces/module.interface';

export interface IAdminsDatabaseRepository {
  findAll(query: FindAdminUsersCommand): Promise<IUser[] | IPagination<IUser>>;
  create(
    data: UserModel,
    roleId: UserRoles,
    permissions: ModulePermissionsModel[],
  ): Promise<IUser>;
  update(
    id: number,
    data: UserModel,
    permissions?: ModulePermissionsModel[],
  ): Promise<IUser>;
  delete(id: number): Promise<void>;
  findOneModulePermission(id: number): Promise<IModule>;
}

export const IAdminsDatabaseRepository = Symbol('IAdminsDatabaseRepository');
