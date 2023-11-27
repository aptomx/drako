import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './infrastructure/entities/user.entity';
import { IUsersDatabaseRepository } from './domain/repositories/users.interface';
import { DatabaseUsersRepository } from './infrastructure/repositories/users.repository';
import { IAdminsDatabaseRepository } from './domain/repositories/admins.interface';
import { DatabaseAdminsRepository } from './infrastructure/repositories/admins.repository';
import { MailModule } from 'src/lib/vendor/mail/mail.module';
import { DiskModule } from 'src/lib/vendor/disk/disk.module';
import { UsersService } from './domain/services/users.service';
import { AdminsService } from './domain/services/admins.service';
import { AuthModule } from '../auth/auth.module';
import { AdminUsersController } from './infrastructure/controllers/admin/admin-users.controller';
import { ModuleEntity } from './infrastructure/entities/module.entity';
import { ModulePermissionsEntity } from './infrastructure/entities/module-permissions.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      ModuleEntity,
      ModulePermissionsEntity,
    ]),
    AuthModule,
    MailModule,
    DiskModule,
  ],
  providers: [
    {
      provide: IUsersDatabaseRepository,
      useClass: DatabaseUsersRepository,
    },
    {
      provide: IAdminsDatabaseRepository,
      useClass: DatabaseAdminsRepository,
    },
    UsersService,
    AdminsService,
  ],
  controllers: [AdminUsersController],
  exports: [UsersService, AdminsService],
})
export class UsersModule {}
