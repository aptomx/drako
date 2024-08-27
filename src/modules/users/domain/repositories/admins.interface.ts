import { IPagination } from '../../../../lib/interfaces/pagination.interface';
import { FindAdminUsersCommand } from '../../infrastructure/commands/admin/find-admin-users.command';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';

export interface IAdminsDatabaseRepository {
  findAll(query: FindAdminUsersCommand): Promise<IUser[] | IPagination<IUser>>;
  create(data: UserModel, roleId: number): Promise<IUser>;
  update(id: number, data: UserModel): Promise<IUser>;
  delete(id: number): Promise<void>;
}

export const IAdminsDatabaseRepository = Symbol('IAdminsDatabaseRepository');
