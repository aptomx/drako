import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { IPagination } from '../../../../lib/interfaces/pagination.interface';
import { FindAdminUsersCommand } from '../../infrastructure/commands/admin/find-admin-users.command';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';
import { UserEntity } from '../../infrastructure/entities/user.entity';

export interface IAdminsDatabaseRepository {
  findAll(query: FindAdminUsersCommand): Promise<IUser[] | IPagination<IUser>>;
  create(data: UserModel, roleId: UserRoles): Promise<UserModel>;
  update(id: number, data: UserModel): Promise<UserModel>;
  delete(id: number): Promise<void>;
  parseEntityToModel(data: UserEntity | IUser): UserModel;
}

export const IAdminsDatabaseRepository = Symbol('IAdminsDatabaseRepository');
