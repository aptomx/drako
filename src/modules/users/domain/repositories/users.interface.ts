import { UserEntity } from '../../infrastructure/entities/user.entity';
import { IUser } from '../interfaces/user.interface';
import { UserModel } from '../models/user.model';

export interface IUsersDatabaseRepository {
  findOne(id: number): Promise<IUser>;
  findOneByEmail(email: string): Promise<IUser>;
  findOneByEmailNotId(userId: number, email: string): Promise<IUser>;
  update(id: number, data: UserModel): Promise<UserModel>;
  parseEntityToModel(data: UserEntity | IUser): UserModel;
}

export const IUsersDatabaseRepository = Symbol('IUsersDatabaseRepository');
