import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { LocalStrategy } from 'src/lib/strategies/local.strategy';
import { DiskModule } from 'src/lib/vendor/disk/disk.module';
import {
  JWT_EXPIRATION_TIME,
  JWT_SECRET_KEY,
} from '../../../config/magicVariables';
import { JwtStrategy } from '../../lib/strategies/jwt.strategy';
import { MailModule } from '../../lib/vendor/mail/mail.module';
import { UserEntity } from '../users/infrastructure/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { IAuthDatabaseRepository } from './domain/repositories/auth.interface';
import { AuthService } from './domain/services/auth.service';
import { SocialNetworkService } from './domain/services/social-network.service';
import { AdminAuthController } from './infrastructure/controllers/admin/admin-auth.controller';
import { AuthController } from './infrastructure/controllers/auth.controller';
import { ClientController } from './infrastructure/controllers/client/client.controller';
import { LoginSocialNetworkController } from './infrastructure/controllers/client/login-social-network.controller';
import { AuthLogsEntity } from './infrastructure/entities/auth-logs.entity';
import { RecoveryCodeEntity } from './infrastructure/entities/recovery-code.entity';
import { DatabaseAuthRepository } from './infrastructure/repositories/auth.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([
      RecoveryCodeEntity,
      UserEntity,
      AuthLogsEntity,
    ]),
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
    ClientController,
    LoginSocialNetworkController,
  ],
  exports: [AuthService],
})
export class AuthModule {}
