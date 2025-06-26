import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DiskModule } from 'src/lib/vendor/disk/disk.module';
import { MailModule } from 'src/lib/vendor/mail/mail.module';
import { AuthModule } from '../auth/auth.module';
import { RecoveryCodeEntity } from '../auth/infrastructure/entities/recovery-code.entity';
import { IAdminsDatabaseRepository } from './domain/repositories/admins.interface';
import { IUsersDatabaseRepository } from './domain/repositories/users.interface';
import { AdminsService } from './domain/services/admins.service';
import { UsersService } from './domain/services/users.service';
import { AdminUsersController } from './infrastructure/controllers/admin/admin-users.controller';
import { ClientUsersController } from './infrastructure/controllers/client/client-users.controller';
import { ModuleEntity } from './infrastructure/entities/module.entity';
import { ModulePermissionsEntity } from './infrastructure/entities/module-permissions.entity';
import { RoleEntity } from './infrastructure/entities/role.entity';
import { UserEntity } from './infrastructure/entities/user.entity';
import { UserRoleEntity } from './infrastructure/entities/user-role.entity';
import { DatabaseAdminsRepository } from './infrastructure/repositories/admins.repository';
import { DatabaseUsersRepository } from './infrastructure/repositories/users.repository';

@Module({
  imports: [
    SequelizeModule.forFeature([
      UserEntity,
      RoleEntity,
      UserRoleEntity,
      ModuleEntity,
      ModulePermissionsEntity,
      RecoveryCodeEntity,
    ]),
    forwardRef(() => AuthModule),
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
  controllers: [AdminUsersController, ClientUsersController],
  exports: [UsersService, AdminsService],
})
export class UsersModule {}
