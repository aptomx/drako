import { IPagination } from 'src/lib/interfaces/pagination.interface';
import { TodoSearch } from '../../infrastructure/commands/todo-search.command';
import { TodoEntity } from '../../infrastructure/entities/todo.entity';
import { ITodoWithUsersDummy } from '../interfaces/todos-with-users-dummy.interface';
import { ITodo } from '../interfaces/todos.interface';
import { TodoModel } from '../models/todo.model';

export interface ITodoDatabaseRepository {
  findAll(
    paginate: boolean,
    query: TodoSearch,
  ): Promise<ITodo[] | IPagination<ITodo>>;
  findOne(id: number): Promise<ITodoWithUsersDummy>;
  create(data: TodoModel): Promise<void>;
  update(id: number, data: TodoModel): Promise<void>;
  delete(id: number): Promise<void>;
  parseEntityToModel(data: TodoEntity): TodoModel;
}

export const ITodoDatabaseRepository = Symbol('ITodoDatabaseRepository');
