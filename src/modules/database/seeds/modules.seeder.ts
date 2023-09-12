import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { ModuleEntity } from '../../users/infrastructure/entities/module.entity';

export default class ModulesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('*************************************************');
    console.log('INIT modules');

    const repository = dataSource.getRepository(ModuleEntity);

    await repository.save([
      { id: 1, name: 'Module 1' },
      { id: 2, name: 'Module 2' },
      { id: 3, name: 'Module 3' },
      { id: 4, name: 'Module 4' },
      { id: 5, name: 'Module 5' },
      { id: 6, name: 'Module 6' },
      { id: 7, name: 'Module 7' },
      { id: 8, name: 'Module 8' },
    ]);

    console.log('*************************************************');
    console.log('END modules');
  }
}
