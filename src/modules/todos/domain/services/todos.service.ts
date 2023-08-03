import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ITodoDatabaseRepository } from '../repositories/todo.interface';
import { TodoCommand } from '../../infrastructure/commands/todo.command';
import { TodoModel } from '../models/todo.model';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';
import {
  CREATED_RECORD,
  DELETED_RECORD,
  ERROR_NOT_FOUND_REGISTER,
  UPDATED_RECORD,
} from 'config/messageResponses';
import { ITodoWithUsersDummy } from '../interfaces/todos-with-users-dummy.interface';
import { TodoSearch } from '../../infrastructure/commands/todo-search.command';
import { ITodo } from '../interfaces/todos.interface';
import { IPagination } from 'src/lib/interfaces/pagination.interface';

@Injectable()
export class TodosService {
  constructor(
    @Inject(ITodoDatabaseRepository)
    private readonly todoDatabaseRepository: ITodoDatabaseRepository,
  ) {}

  async create(data: TodoCommand): Promise<IDisplayMessageSuccess> {
    const todoM = new TodoModel(data.content, data.isDone);
    await this.todoDatabaseRepository.create(todoM);
    return { displayMessage: CREATED_RECORD };
  }

  async findAll(query: TodoSearch): Promise<ITodo[] | IPagination<ITodo>> {
    return await this.todoDatabaseRepository.findAll(true, query);
  }

  async findOne(id: number): Promise<ITodoWithUsersDummy> {
    const data: ITodoWithUsersDummy = await this.todoDatabaseRepository.findOne(
      id,
    );
    if (!data) {
      throw new NotFoundException(ERROR_NOT_FOUND_REGISTER(id));
    }
    return data;
  }

  async update(id: number, isDone: boolean): Promise<IDisplayMessageSuccess> {
    const todo: ITodoWithUsersDummy = await this.findOne(id);
    const todoM = this.todoDatabaseRepository.parseEntityToModel(todo);
    todoM.setIsDone(isDone);
    todoM.setRandomTitle();
    await this.todoDatabaseRepository.update(id, todoM);
    return { displayMessage: UPDATED_RECORD };
  }

  async remove(id: number): Promise<IDisplayMessageSuccess> {
    const todo: ITodoWithUsersDummy = await this.findOne(id);
    const todoM = this.todoDatabaseRepository.parseEntityToModel(todo);
    if (!todoM.isEditable()) {
      throw new ConflictException('No se puede eliminar un todo completado');
    }
    await this.todoDatabaseRepository.delete(id);
    return { displayMessage: DELETED_RECORD };
  }
}
