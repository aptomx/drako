import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from 'config/registers/app.config';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';

@Injectable()
export class MainService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly apConfig: ConfigType<typeof appConfig>,
  ) {}

  getWelcome(): IDisplayMessageSuccess {
    return { displayMessage: `Welcome to ${this.apConfig.appName}` };
  }

  getWelcomeApi(): IDisplayMessageSuccess {
    return { displayMessage: `Welcome to ${this.apConfig.appName} api` };
  }

  health(): IDisplayMessageSuccess {
    return { displayMessage: 'ok!' };
  }
}
