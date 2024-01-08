import { SES_REGION } from './../../../../config/magicVariables/index';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as hbs from 'nodemailer-express-handlebars';
import { join } from 'path';
import * as aws from '@aws-sdk/client-ses';
import {
  APP_URL,
  MAIL_DRIVER,
  MAIL_HOST,
  MAIL_PASSWORD,
  MAIL_PORT,
  MAIL_USERNAME,
} from 'config/magicVariables';
import { MailDrivers } from 'config/enums/mail.enum';
import { LoggerReportingModule } from '../loggerReporting/loggerReporting.module';

@Module({
  imports: [LoggerReportingModule],
  providers: [
    {
      provide: 'TRANSPORT_EMAIL',
      useFactory: (configService: ConfigService) => {
        const driver = configService.get(MAIL_DRIVER);
        let transporter;
        if (driver === MailDrivers.ses) {
          const ses = new aws.SES({
            region: configService.get(SES_REGION),
          });
          transporter = nodemailer.createTransport({
            SES: { ses, aws },
          });
        } else {
          const port = +configService.get(MAIL_PORT);
          transporter = nodemailer.createTransport({
            host: configService.get(MAIL_HOST),
            port: port,
            secure: port === 465 ? true : false,
            auth: {
              user: configService.get(MAIL_USERNAME),
              pass: configService.get(MAIL_PASSWORD),
            },
          });
        }
        const handlebarOptions = {
          viewEngine: {
            extname: '.hbs',
            defaultLayout: 'main',
            layoutsDir: join(__dirname, 'templates/layouts'),
            partialsDir: join(__dirname, 'templates/partials'),
            helpers: {
              pathImage: (initialPath) =>
                `${configService.get(APP_URL)}/${initialPath}`,
            },
          },
          viewPath: join(__dirname, 'templates/views'),
          extName: '.hbs',
        };
        transporter.use('compile', hbs(handlebarOptions));
        return transporter;
      },
      inject: [ConfigService],
    },
    MailService,
  ],
  exports: ['TRANSPORT_EMAIL', MailService],
})
export class MailModule {}
