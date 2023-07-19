import { SetMetadata } from '@nestjs/common';

export enum RoleDecorator {
  Admin = 1,
  Client = 2,
}
export const ROLES_KEY = 'roles';
export const Roles = (...roles: RoleDecorator[]) =>
  SetMetadata(ROLES_KEY, roles);
