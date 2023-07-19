import { Injectable } from '@nestjs/common';
import { TodoModel } from '../../domain/models/todo.model';
import { ITodoDatabaseRepository } from '../../domain/repositories/todo.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from '../entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class DatabaseTodoRepository implements ITodoDatabaseRepository {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoEntityRepository: Repository<TodoEntity>,
  ) {}

  async create(todo: TodoModel): Promise<TodoModel> {
    await this.todoEntityRepository.save(todo);
    return todo;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async findAll(paginate: boolean): Promise<TodoModel[]> {
    const todosEntity = await this.todoEntityRepository.find();
    return todosEntity.map((data) => this.parseEntityToModel(data));
  }

  async findOne(id: number): Promise<TodoModel> {
    const todoEntity = await this.todoEntityRepository.findOne({
      where: { id },
    });
    return todoEntity
      ? this.parseEntityToModel(todoEntity)
      : (todoEntity as TodoModel);
  }

  async update(id: number, data: TodoModel): Promise<void> {
    data.setUpdatedAt();
    await this.todoEntityRepository.update(id, data);
  }

  async remove(id: number): Promise<void> {
    await this.todoEntityRepository.delete(id);
  }

  private parseEntityToModel(data): TodoModel {
    return new TodoModel(
      data.content,
      data.isDone,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }
}
