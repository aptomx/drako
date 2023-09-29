export interface IFacebook {
  provider: 'facebook';
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
