import { BadRequestException, Injectable } from '@nestjs/common';
import { LoginSocialNetworkCommand } from '../../infrastructure/commands/login-social-network.command';
import { IAuthentication } from '../interfaces/authentication.interface';
import { IGoogle } from '../interfaces/google.interface';
import { IFacebook } from '../interfaces/facebook.interface';
import { DriversSocialNetwork } from '../enums/drivers-social-network.enum';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import {
  SOCIAL_NETWORK_EMAIL_ERROR,
  SOCIAL_NETWORK_TOKEN_ERROR,
} from 'config/constants';
import { UsersService } from 'src/modules/users/domain/services/users.service';
import { IUser } from 'src/modules/users/domain/interfaces/user.interface';
import { UserModel } from 'src/modules/users/domain/models/user.model';
import { DiskService } from 'src/lib/vendor/disk/disk.service';
import { AuthService } from './auth.service';

@Injectable()
export class SocialNetworkService {
  constructor(
    private httpService: HttpService,
    private usersService: UsersService,
    private readonly diskService: DiskService,
    private authService: AuthService,
  ) {}

  async registerSocialNetwork(
    loginSocialNetwork: LoginSocialNetworkCommand,
  ): Promise<IAuthentication> {
    const payload = await this.getDataByToken(loginSocialNetwork);
    const user = await this.usersService.findOneByEmail(payload.email);
    const userData = await this.createOrUpdateUser(
      user,
      payload,
      loginSocialNetwork,
    );
    const token = await this.authService.generateTokenByUser(userData);
    const parseUser = await this.usersService.findOne(userData.id);

    return {
      user: parseUser,
      accessToken: token,
    };
  }

  async getDataByToken(
    options: LoginSocialNetworkCommand,
  ): Promise<IGoogle | IFacebook> {
    let data: IGoogle | IFacebook;
    if (options.driver == DriversSocialNetwork.Facebook) {
      data = await this.getDataByFacebook(options);
    } else {
      data = await this.getDataByGoogle(options);
    }
    this.validatePayload(data, options.driver);
    return data;
  }

  async getDataByFacebook(
    options: LoginSocialNetworkCommand,
  ): Promise<IFacebook> {
    try {
      const info = await firstValueFrom(
        this.httpService.get(
          `https://graph.facebook.com/v2.9/me?fields=email,picture.width(720).height(720),name,first_name,last_name&access_token=${options.token}`,
        ),
      );
      info.data.provider = DriversSocialNetwork.Facebook;
      return info.data as IFacebook;
    } catch (error) {
      throw new BadRequestException(SOCIAL_NETWORK_TOKEN_ERROR(options.driver));
    }
  }

  async getDataByGoogle(options: LoginSocialNetworkCommand): Promise<IGoogle> {
    try {
      const info = await firstValueFrom(
        this.httpService.get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${options.token}`,
        ),
      );
      info.data.provider = DriversSocialNetwork.Google;
      return info.data as IGoogle;
    } catch (error) {
      throw new BadRequestException(SOCIAL_NETWORK_TOKEN_ERROR(options.driver));
    }
  }

  validatePayload(response: IGoogle | IFacebook, driver: string): void {
    if (!response.email) {
      throw new BadRequestException(SOCIAL_NETWORK_EMAIL_ERROR(driver));
    }
  }

  async createOrUpdateUser(
    user: IUser,
    payload: IGoogle | IFacebook,
    body: LoginSocialNetworkCommand,
  ): Promise<UserModel> {
    let name = null;
    let lastName = null;
    if (payload.provider === DriversSocialNetwork.Facebook) {
      name = payload?.first_name;
      lastName = payload?.last_name;
    }
    if (payload.provider === DriversSocialNetwork.Google) {
      name = payload?.given_name;
      lastName = payload?.family_name;
    }
    if (body.name) {
      name = body.name;
    }
    if (body.lastName) {
      lastName = body.lastName;
    }

    if (user) {
      return await this.usersService.updateUserSocialMedia(
        user.id,
        name,
        lastName,
        body.driver,
        body.token,
      );
    }

    const pictureUrl = await this.savePicture(payload, body.driver);
    return await this.usersService.createUserSocialMedia(
      payload.email,
      name,
      lastName,
      body.driver,
      body.token,
      pictureUrl,
    );
  }

  getPictureUrl(response: IGoogle | IFacebook): string {
    let picture = null;
    if (response.provider === DriversSocialNetwork.Facebook) {
      picture = response.picture.data.url;
    } else {
      picture = response.picture.replace('s96-c', 's400-c');
    }
    return picture;
  }

  async savePicture(
    response: IGoogle | IFacebook,
    driver: string,
  ): Promise<string> {
    const pictureUrl = this.getPictureUrl(response);

    if (pictureUrl && pictureUrl != null) {
      const options: AxiosRequestConfig = {
        responseType: 'arraybuffer',
      };
      const request = await firstValueFrom(
        this.httpService.get(encodeURI(pictureUrl), options),
      );
      const fileContent: Buffer = request.data;

      const fileFormat = {
        //Dummy format
        fieldname: undefined,
        filename: `imagen-${driver}`,
        originalname: `imagen-${driver}`,
        encoding: undefined,
        mimetype: `image/jpeg`,
        buffer: fileContent,
        size: 100,
        stream: undefined,
        destination: undefined,
        path: undefined,
      };

      const result = await this.diskService.uploadDisk(
        fileFormat,
        'userPicture',
      );
      return result.url;
    }
    return null;
  }
}
