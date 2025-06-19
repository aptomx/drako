import { Inject, Injectable } from '@nestjs/common';
import {
  ITodoDatabaseRepository,
  ITodoDatabaseRepositoryToken,
} from '../repositories/todo.interface';
import { TodoCommand } from '../../infrastructure/commands/todo.command';
import { TodoModel } from '../models/todo.model';
import { ERROR_NOT_FOUND_REGISTER } from 'config/messageResponses';
import { TodoSearchCommand } from '../../infrastructure/commands/todo-search.command';
import { ITodo } from '../interfaces/todos.interface';
import { IPagination } from 'src/lib/interfaces/pagination.interface';
import { TodoNotFoundError } from '../../errors/todo-not-found-error';
import { TodoCompletedDeletionError } from '../../errors/todo-completed-deletion-error';

@Injectable()
export class TodosService {
  constructor(
    @Inject(ITodoDatabaseRepositoryToken)
    private readonly todoDatabaseRepository: ITodoDatabaseRepository,
  ) {}

  async create(data: TodoCommand): Promise<ITodo> {
    const todoM = new TodoModel(data.content, data.isDone);
    return await this.todoDatabaseRepository.create(todoM);
  }

  async findAll(
    query: TodoSearchCommand,
  ): Promise<ITodo[] | IPagination<ITodo>> {
    return await this.todoDatabaseRepository.findAll(query);
  }

  async findOne(id: number): Promise<ITodo> {
    const data: ITodo = await this.todoDatabaseRepository.findOne(id);

    if (!data) {
      throw new TodoNotFoundError(ERROR_NOT_FOUND_REGISTER(id));
    }
    return data;
  }

  async update(id: number, isDone: boolean): Promise<ITodo> {
    const todo: ITodo = await this.findOne(id);
    const todoM = this.parseEntityToModel(todo);
    todoM.setIsDone(isDone);
    todoM.setRandomTitle();
    return await this.todoDatabaseRepository.update(id, todoM);
  }

  async remove(id: number): Promise<void> {
    const todo: ITodo = await this.findOne(id);
    const todoM = this.parseEntityToModel(todo);
    if (!todoM.isEditable()) {
      throw new TodoCompletedDeletionError(
        'No se puede eliminar un todo completado',
      );
    }
    await this.todoDatabaseRepository.delete(id);
  }

  private parseEntityToModel(data: ITodo): TodoModel {
    return new TodoModel(
      data.content,
      data.isDone,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }
}
