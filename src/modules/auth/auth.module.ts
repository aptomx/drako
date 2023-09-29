import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import {
  JWT_EXPIRATION_TIME,
  JWT_SECRET_KEY,
} from '../../../config/magicVariables';
import { JwtStrategy } from '../../lib/strategies/jwt.strategy';
import { IAuthDatabaseRepository } from './domain/repositories/auth.interface';
import { DatabaseAuthRepository } from './infrastructure/repositories/auth.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecoveryCodeEntity } from './infrastructure/entities/recovery-code.entity';
import { MailModule } from '../../lib/vendor/mail/mail.module';
import { AuthService } from './domain/services/auth.service';
import { LocalStrategy } from 'src/lib/strategies/local.strategy';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { AdminAuthController } from './infrastructure/controllers/admin/admin-auth.controller';
import { LoginSocialNetworkController } from './infrastructure/controllers/login-social-network.controller';
import { SocialNetworkService } from './domain/services/social-network.service';
import { HttpModule } from '@nestjs/axios';
import { DiskModule } from 'src/lib/vendor/disk/disk.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RecoveryCodeEntity]),
    forwardRef(() => UsersModule),
    MailModule,
    JwtModule.registerAsync({
      useFactory: (config: ConfigService) => {
        const secret = config.get(JWT_SECRET_KEY);
        const expirationTime = config.get(JWT_EXPIRATION_TIME);
        return {
          secret: secret,
          signOptions: {
            expiresIn: expirationTime,
          },
        };
      },
      inject: [ConfigService],
    }),
    HttpModule,
    DiskModule,
  ],
  providers: [
    AuthService,
    SocialNetworkService,
    LocalStrategy,
    JwtStrategy,
    {
      provide: IAuthDatabaseRepository,
      useClass: DatabaseAuthRepository,
    },
  ],
  controllers: [
    AuthController,
    AdminAuthController,
    LoginSocialNetworkController,
  ],
  exports: [AuthService],
})
export class AuthModule {}
