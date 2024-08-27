import { IPagination } from 'src/lib/interfaces/pagination.interface';
import { TodoSearchCommand } from '../../infrastructure/commands/todo-search.command';
import { ITodo } from '../interfaces/todos.interface';
import { TodoModel } from '../models/todo.model';

export interface ITodoDatabaseRepository {
  findAll(query: TodoSearchCommand): Promise<ITodo[] | IPagination<ITodo>>;
  findOne(id: number): Promise<ITodo>;
  create(data: TodoModel): Promise<ITodo>;
  update(id: number, data: TodoModel): Promise<ITodo>;
  delete(id: number): Promise<void>;
}

export const ITodoDatabaseRepository = Symbol('ITodoDatabaseRepository');
