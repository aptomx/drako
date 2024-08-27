import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginSocialNetworkCommand } from '../../infrastructure/commands/login-social-network.command';
import { IAuthentication } from '../interfaces/authentication.interface';
import { IGoogle } from '../interfaces/google.interface';
import { IFacebook } from '../interfaces/facebook.interface';
import { DriversSocialNetwork } from '../enums/drivers-social-network.enum';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { AxiosRequestConfig } from 'axios';
import { UsersService } from 'src/modules/users/domain/services/users.service';
import { IUser } from 'src/modules/users/domain/interfaces/user.interface';
import { UserModel } from 'src/modules/users/domain/models/user.model';
import { DiskService } from 'src/lib/vendor/disk/disk.service';
import { AuthService } from './auth.service';
import { IApple } from '../interfaces/apple.interface';
import appleConfig from 'config/registers/apple.config';
import { ConfigType } from '@nestjs/config';
import verifyAppleToken from './apple/verify-apple-id-token';
import {
  SOCIAL_NETWORK_EMAIL_ERROR,
  SOCIAL_NETWORK_TOKEN_ERROR,
} from 'config/messageResponses';

@Injectable()
export class SocialNetworkService {
  constructor(
    private httpService: HttpService,
    private usersService: UsersService,
    private readonly diskService: DiskService,
    private authService: AuthService,
    @Inject(appleConfig.KEY)
    private readonly appleConf: ConfigType<typeof appleConfig>,
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
  ): Promise<IGoogle | IFacebook | IApple> {
    let data: IGoogle | IFacebook | IApple;
    if (options.driver == DriversSocialNetwork.Facebook) {
      data = await this.getDataByFacebook(options);
    } else if (options.driver == DriversSocialNetwork.Google) {
      data = await this.getDataByGoogle(options);
    } else {
      //options.driver == DriversSocialNetwork.Apple
      data = await this.getDataByApple(options);
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

  async getDataByApple(options: LoginSocialNetworkCommand): Promise<IApple> {
    //Valid Apple configuration exists
    if (!this.appleConf.appleClientId) {
      throw new NotFoundException(
        'No se encontró el appleClientId configurado',
      );
    }
    //Valid token, expiration, aud and iss of the signature
    const jwtClaims = await verifyAppleToken({
      tokenId: options.token,
      clientId: this.appleConf.appleClientId,
    });
    const { email } = jwtClaims;
    const firstName = email;
    const lastName = '';

    return {
      provider: DriversSocialNetwork.Apple,
      email,
      first_name: firstName,
      last_name: lastName,
    };
  }

  validatePayload(
    response: IGoogle | IFacebook | IApple,
    driver: string,
  ): void {
    if (!response.email) {
      throw new BadRequestException(SOCIAL_NETWORK_EMAIL_ERROR(driver));
    }
  }

  async createOrUpdateUser(
    user: IUser,
    payload: IGoogle | IFacebook | IApple,
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
    if (payload.provider === DriversSocialNetwork.Apple) {
      name = payload?.first_name;
      lastName = payload?.last_name;
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
    let pictureUrl = null;
    if (payload.provider !== DriversSocialNetwork.Apple) {
      pictureUrl = await this.savePicture(payload, body.driver);
    }
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
    } else if (response.provider === DriversSocialNetwork.Google) {
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
