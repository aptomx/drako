import { BaseEntity } from 'src/lib/abstracts/base.abstract';

export interface IModulePermission extends BaseEntity {
  userId: number;
  moduleId: number;
  view: boolean;
  edit: boolean;
}
