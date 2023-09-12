import { UserModel } from '../../../users/domain/models/user.model';

export interface IAuthentication {
  user: UserModel;
  accessToken: string;
}
