import { DriversSocialNetwork } from '../enums/drivers-social-network.enum';

export interface IGoogle {
  provider: DriversSocialNetwork.Google;
  email: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}
