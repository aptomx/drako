/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConfigType } from '@nestjs/config';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import {
  ERROR_DRIVER_EMAIL,
  ERROR_TEMPLATE_EMAIL,
} from 'config/messageResponses';
import mailConfig from 'config/registers/mail.config';
import appConfig from 'config/registers/app.config';

@Injectable()
export class MailService {
  private readonly templateTypes = {
    example: 'example',
    example2: 'example2',
    verifyEmail: 'verify-email',
    welcomeAdmin: 'welcome-admin',
    recoveryPasswordCode: 'recovery-password-code',
    passwordChanged: 'password-changed',
    welcomeClient: 'welcome-client',
  };

  private readonly logger: Logger = new Logger('Mails');

  constructor(
    @Inject(appConfig.KEY)
    private readonly apConfig: ConfigType<typeof appConfig>,
    @Inject(mailConfig.KEY)
    private readonly mlConfig: ConfigType<typeof mailConfig>,
    @Inject('TRANSPORT_EMAIL') private transporter: Transporter,
  ) {}

  async sendMail(
    type: string,
    emailToList: string[],
    data: any,
    subject: string,
  ) {
    if (!this.mlConfig.mailDriver) {
      throw new Error(ERROR_DRIVER_EMAIL);
    }
    const getTemplateEmail = this.templateTypes[type];
    if (!getTemplateEmail) {
      throw new Error(ERROR_TEMPLATE_EMAIL);
    }

    const context = { ...{ appUrl: this.apConfig.appUrl }, ...data };
    const parameters: any = {
      from: `${this.mlConfig.mailFromName} <${this.mlConfig.mailFromAddress}>`,
      to: emailToList.join(),
      subject: subject,
      template: getTemplateEmail,
      context: context,
    };
    if (data.attachments) {
      /* //EXAMPLE->
      data.attachments = [
            {
              filename: '',
              path: 'path or url',
              cid: 'img', // not repeat the same string in given attachment array of object.
            },
          ]; 
      */
      parameters.attachments = data.attachments;
    }
    await this.transporter
      .sendMail(parameters)
      .then((response) => {
        this.logger.log({
          message: `Mail sent successfully`,
          id: response.messageId,
          response: response,
        });
      })
      .catch((error) => {
        delete parameters['html'];
        const exceptionStack: string = 'stack' in error ? error.stack : '';
        this.logger.error({
          message: `Problems sending mail type`,
          error: exceptionStack,
          data: parameters,
        });
      });
  }
}
