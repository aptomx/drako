import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { RoleEntity } from '../../users/infrastructure/entities/role.entity';

export default class RolesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('*************************************************');
    console.log('INIT roles');

    const repository = dataSource.getRepository(RoleEntity);

    await repository.save([
      { id: 1, name: 'Admin' },
      { id: 2, name: 'Client' },
    ]);

    console.log('*************************************************');
    console.log('END roles');
  }
}
