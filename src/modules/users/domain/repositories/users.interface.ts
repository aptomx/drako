import { IRole } from '../interfaces/role.interface';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';

export interface IUsersDatabaseRepository {
  findOne(id: number): Promise<IUser>;
  findOneByEmail(email: string): Promise<IUser>;
  findOneByEmailNotId(userId: number, email: string): Promise<IUser>;
  update(id: number, data: UserModel): Promise<IUser>;
  findRole(roleName: string): Promise<IRole>;
  create(data: UserModel, roleId: number): Promise<IUser>;
}

export const IUsersDatabaseRepository = Symbol('IUsersDatabaseRepository');
