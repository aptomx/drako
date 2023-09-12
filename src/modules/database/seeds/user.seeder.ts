import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { UserEntity } from '../../users/infrastructure/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserRoles } from '../../../lib/enums/user-roles.enum';
import { UserRoleEntity } from '../../users/infrastructure/entities/user-role.entity';
import { ModuleEntity } from '../../users/infrastructure/entities/module.entity';
import { ModulePermissionsEntity } from '../../users/infrastructure/entities/module-permissions.entity';

export default class UserSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('*************************************************');
    console.log('INIT users');

    const password = await bcrypt.hash('87411123', 10);

    await dataSource.transaction(async (transactionalEntityManager) => {
      const user = await transactionalEntityManager.save(UserEntity, [
        {
          id: 1,
          email: 'admin@admin.mx',
          password: password,
          firstName: 'Admin',
          lastName: 'Apto',
          fullName: 'Apto Admin',
          emailVerified: true,
        },
      ]);

      await transactionalEntityManager.save(UserRoleEntity, [
        {
          id: 1,
          roleId: UserRoles.Admin,
          userId: user[0].id,
        },
      ]);

      const modules = await transactionalEntityManager.find(ModuleEntity);
      const permissions = modules.map((module) => {
        return {
          id: module.id,
          userId: user[0].id,
          moduleId: module.id,
          view: true,
          edit: true,
        };
      });

      await transactionalEntityManager.save(
        ModulePermissionsEntity,
        permissions,
      );
    });

    console.log('*************************************************');
    console.log('END users');
  }
}
