import { BaseEntity } from 'src/lib/abstracts/base.abstract';

export interface IUser extends BaseEntity {
  uuid: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  isActive: boolean;
  emailVerified: boolean;
  photo?: string;
  driver?: string;
  token?: string;
}
