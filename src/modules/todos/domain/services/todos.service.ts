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
  DELETED_RECORD,
  ERROR_NOT_FOUND_REGISTER,
  UPDATED_RECORD,
} from 'config/messageResponses';

@Injectable()
export class TodosService {
  constructor(
    @Inject(ITodoDatabaseRepository)
    private readonly todoDatabaseRepository: ITodoDatabaseRepository,
  ) {}

  async create(data: TodoCommand): Promise<TodoModel> {
    const todoM = new TodoModel(data.content, data.isDone);
    return await this.todoDatabaseRepository.create(todoM);
  }

  async findAll(): Promise<TodoModel[]> {
    return await this.todoDatabaseRepository.findAll(false);
  }

  async findOne(id: number): Promise<TodoModel> {
    const data: TodoModel = await this.todoDatabaseRepository.findOne(id);
    if (!data) {
      throw new NotFoundException(ERROR_NOT_FOUND_REGISTER(id));
    }
    return data;
  }

  async update(id: number, isDone: boolean): Promise<IDisplayMessageSuccess> {
    const todoM: TodoModel = await this.findOne(id);
    todoM.isDone = isDone;
    todoM.setRandomTitle();
    await this.todoDatabaseRepository.update(id, todoM);
    return { displayMessage: UPDATED_RECORD };
  }

  async remove(id: number): Promise<IDisplayMessageSuccess> {
    const todoM: TodoModel = await this.findOne(id);
    if (!todoM.isEditable()) {
      throw new ConflictException('No se puede eliminar un todo completado');
    }
    await this.todoDatabaseRepository.remove(id);
    return { displayMessage: DELETED_RECORD };
  }
}
