import { TodoEntity } from './../../todos/infrastructure/entities/todo.entity';
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';

export default class TodosSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    console.log('*************************************************');
    console.log('INIT todos');

    const repository = dataSource.getRepository(TodoEntity);

    await repository.save([
      { id: 1, content: 'A1', isDone: true },
      { id: 2, content: 'B2', isDone: false },
      { id: 3, content: 'C3', isDone: true },
      { id: 4, content: 'D4', isDone: false },
      { id: 5, content: 'E5', isDone: true },
      { id: 6, content: 'F6', isDone: false },
      { id: 7, content: 'G7', isDone: true },
    ]);

    console.log('END todos');
    console.log('*************************************************');
  }
}
