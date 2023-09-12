import { IUserRole } from '../interfaces/user-role.interface';

export class UserRoleModel implements IUserRole {
  id: number;

  roleId: number;

  userId: number;

  createdAt: Date;

  updatedAt: Date;

  constructor(
    roleId: number,
    userId: number,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.roleId = roleId;
    this.userId = userId;
    this.id = id;
    this.createdAt = createdAt ? new Date(createdAt) : undefined;
    this.updatedAt = updatedAt ? new Date(updatedAt) : undefined;
  }
}
