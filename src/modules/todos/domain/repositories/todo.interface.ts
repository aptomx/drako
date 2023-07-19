import { TodoModel } from '../models/todo.model';

export interface ITodoDatabaseRepository {
  findAll(paginate: boolean): Promise<TodoModel[]>;
  create(data: TodoModel): Promise<TodoModel>;
  update(id: number, data: TodoModel): Promise<void>;
  findOne(id: number): Promise<TodoModel>;
  remove(id: number): Promise<void>;
}

export const ITodoDatabaseRepository = Symbol('ITodoDatabaseRepository');
