import { Module } from '@nestjs/common';
import { ITodoDatabaseRepositoryToken } from './domain/repositories/todo.interface';
import { DatabaseTodoRepository } from './infrastructure/repositories/todo.repository';
import { TodosService } from './domain/services/todos.service';
import { TodosController } from './infrastructure/controllers/todos.controller';
import { TodoEntity } from './infrastructure/entities/todo.entity';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([TodoEntity])],
  providers: [
    {
      provide: ITodoDatabaseRepositoryToken,
      useClass: DatabaseTodoRepository,
    },
    TodosService,
  ],
  controllers: [TodosController],
})
export class TodosModule {}
