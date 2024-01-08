import { DriversSocialNetwork } from '../enums/drivers-social-network.enum';

export interface IFacebook {
  provider: DriversSocialNetwork.Facebook;
  email: string;
  picture: {
    data: {
      width: number;
      height: number;
      url: string;
    };
  };
  name: string;
  first_name: string;
  last_name: string;
}
