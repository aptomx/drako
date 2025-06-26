import { Inject, Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterConfigService } from 'config/filesystem/multer.service';
import validationSchema from 'config/index.config';
import appConfig from 'config/registers/app.config';
import appleConfig from 'config/registers/apple.config';
import filesystemsConfig from 'config/registers/filesystems.config';
import jwtConfig from 'config/registers/jwt.config';
import mailConfig from 'config/registers/mail.config';
import { createZodValidation } from 'config/utils/zod-to-joi-adapter';
import { join } from 'path';
import { BasicModule } from './lib/examples/basic.module';
import { MainModule } from './lib/main/main.module';
import { DiskModule } from './lib/vendor/disk/disk.module';
import { LoggerModule } from './lib/vendor/logger/logger.module';
import { MailModule } from './lib/vendor/mail/mail.module';
import { ResizeImagesModule } from './lib/vendor/resize-images/resize-images.module';
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './modules/database/database.module';
import { TodosModule } from './modules/todos/todos.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [appConfig, mailConfig, filesystemsConfig, jwtConfig, appleConfig],
      validate: createZodValidation(validationSchema),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'public'),
      exclude: ['/*'],
    }),
    MulterModule.registerAsync({
      useClass: MulterConfigService,
    }),
    DiskModule,
    ResizeImagesModule,
    MailModule,
    MainModule,
    BasicModule,
    DatabaseModule,
    TodosModule,
    UsersModule,
    AuthModule,
    LoggerModule,
  ],
})
export class AppModule {
  static appName: string;

  static appPort: number | string;

  static appUrl: string;

  constructor(
    @Inject(appConfig.KEY)
    private readonly bsConfig: ConfigType<typeof appConfig>,
  ) {
    AppModule.appName = this.bsConfig.appName;
    AppModule.appPort = this.bsConfig.appPort;
    AppModule.appUrl = this.bsConfig.appUrl;
  }
}
