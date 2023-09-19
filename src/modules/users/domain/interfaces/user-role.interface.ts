import { BaseEntity } from 'src/lib/abstracts/base.abstract';

export interface IUserRole extends BaseEntity {
  userId: number;
  roleId: number;
}
