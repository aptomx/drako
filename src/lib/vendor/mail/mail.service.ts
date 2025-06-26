import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  ERROR_DRIVER_EMAIL,
  ERROR_TEMPLATE_EMAIL,
} from 'config/messageResponses';
import appConfig from 'config/registers/app.config';
import mailConfig from 'config/registers/mail.config';
import { Transporter } from 'nodemailer';
import { LoggerReportingService } from '../loggerReporting/loggerReporting.service';
import { MailError } from './errors/mail-error';
import { MailMissingDriverError } from './errors/mail-missing-driver-error';
import { MailTemplateNotFoundError } from './errors/mail-template-not-found-error';

@Injectable()
export class MailService {
  private readonly templateTypes = {
    example: 'example',
    example2: 'example2',
    verifyEmail: 'verify-email',
    welcomeAdmin: 'welcome-admin',
    recoveryPasswordCode: 'recovery-password-code',
    passwordChanged: 'password-changed',
    welcomeSocialNetwork: 'welcome-social-network',
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
    // biome-ignore lint/suspicious/noExplicitAny: Email template data structure varies
    data: any,
    subject: string,
    bcc: string[] = [],
  ) {
    if (!this.mlConfig.mailDriver) {
      throw new MailMissingDriverError(ERROR_DRIVER_EMAIL);
    }
    const getTemplateEmail = this.templateTypes[type];
    if (!getTemplateEmail) {
      throw new MailTemplateNotFoundError(ERROR_TEMPLATE_EMAIL);
    }

    const context = { ...{ appUrl: this.apConfig.appUrl }, ...data };
    // biome-ignore lint/suspicious/noExplicitAny: Nodemailer parameters can vary
    const parameters: any = {
      from: `${this.mlConfig.mailFromName} <${this.mlConfig.mailFromAddress}>`,
      to: emailToList.join(),
      subject: subject,
      template: getTemplateEmail,
      context: context,
    };
    if (bcc.length > 0) {
      parameters.bcc = bcc.join();
    }
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

        const mailError = new MailError('Error sending email', {
          message: error.message,
          parameters,
        });

        LoggerReportingService.captureException(mailError);
      });
  }
}
