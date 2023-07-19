import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import appConfig from 'config/registers/app.config';
import mailConfig from 'config/registers/mail.config';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import { MailService } from 'src/lib/vendor/mail/mail.service';

@Injectable()
export class BasicService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly apConfig: ConfigType<typeof appConfig>,
    @Inject(mailConfig.KEY)
    private readonly mlConfig: ConfigType<typeof mailConfig>,
    private readonly mailService: MailService,
  ) {}

  async testSendEmail(): Promise<IDisplayMessageSuccess> {
    const fileUrl = `${this.apConfig.appUrl}/logo.png`;
    await this.mailService.sendMail(
      'example',
      [this.mlConfig.mailTest],
      {
        attachments: [
          {
            filename: fileUrl,
            path: fileUrl,
            cid: fileUrl,
          },
        ],
      },
      'Aviso de ejemplo',
    );
    await this.mailService.sendMail(
      'example2',
      [this.mlConfig.mailTest],
      {
        url: 'https://www.google.com',
      },
      'Aviso de ejemplo 2',
    );
    return { displayMessage: 'Mails send' };
  }
}
