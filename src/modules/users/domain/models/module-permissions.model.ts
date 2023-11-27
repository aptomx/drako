import { IModulePermission } from '../interfaces/module-permission.interface';

export class ModulePermissionsModel implements IModulePermission {
  id: number;

  userId: number;

  moduleId: number;

  view: boolean;

  edit: boolean;

  createdAt: Date;

  updatedAt: Date;

  constructor(
    userId: number,
    moduleId: number,
    view: boolean,
    edit: boolean,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.userId = userId;
    this.moduleId = moduleId;
    this.view = view;
    this.edit = edit;
    this.id = id;
    this.createdAt = createdAt ? new Date(createdAt) : undefined;
    this.updatedAt = updatedAt ? new Date(updatedAt) : undefined;
  }
}
