import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ITodoDatabaseRepository } from './domain/repositories/todo.interface';
import { TodosService } from './domain/services/todos.service';
import { TodosController } from './infrastructure/controllers/todos.controller';
import { TodoEntity } from './infrastructure/entities/todo.entity';
import { DatabaseTodoRepository } from './infrastructure/repositories/todo.repository';

@Module({
  imports: [SequelizeModule.forFeature([TodoEntity])],
  providers: [
    {
      provide: ITodoDatabaseRepository,
      useClass: DatabaseTodoRepository,
    },
    TodosService,
  ],
  controllers: [TodosController],
})
export class TodosModule {}
