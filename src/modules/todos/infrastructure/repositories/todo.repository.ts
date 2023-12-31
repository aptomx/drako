import { Injectable } from '@nestjs/common';
import { TodoModel } from '../../domain/models/todo.model';
import { ITodoDatabaseRepository } from '../../domain/repositories/todo.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from '../entities/todo.entity';
import { FindOneOptions, Repository, SelectQueryBuilder } from 'typeorm';
import { TodoSearchCommand } from '../commands/todo-search.command';
import { ITodo } from '../../domain/interfaces/todos.interface';
import { IPagination } from 'src/lib/interfaces/pagination.interface';
import { Sort } from 'src/lib/enums/sort.enum';
import { SortType } from 'src/lib/enums/sort-type.enum';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGINATE,
  DEFAULT_PERPAGE,
} from 'config/constants';
import getSkip from 'src/lib/utils/calculate-skip-pagination';
import getTotalPages from 'src/lib/utils/calculate-total-pages';
import isPaginate from 'src/lib/utils/is-paginate';

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

  async findAll(
    query: TodoSearchCommand,
  ): Promise<ITodo[] | IPagination<ITodo>> {
    const table = 'todo';
    const {
      sortType = SortType.CREATED_AT,
      sort = Sort.DESC,
      page = DEFAULT_PAGE,
      perPage = DEFAULT_PERPAGE,
      paginate = DEFAULT_PAGINATE,
    } = query;

    const queryBuilder: SelectQueryBuilder<TodoEntity> =
      this.todoEntityRepository
        .createQueryBuilder(table)
        .orderBy(`${table}.${sortType}`, sort);

    if (!isPaginate(paginate)) {
      const list = await queryBuilder.getMany();
      return list.map((data) => data as ITodo);
    }

    queryBuilder.skip(getSkip(page, perPage)).take(perPage);
    const [items, total] = await queryBuilder.getManyAndCount();
    const response = {
      items: items.map((data) => data as ITodo),
      meta: {
        totalItems: total,
        itemsPerPage: perPage,
        totalPages: getTotalPages(total, perPage),
        currentPage: page,
      },
    };
    return response;
  }

  async findOne(id: number): Promise<ITodo> {
    const options: FindOneOptions<TodoEntity> = {
      where: { id },
    };
    const todoEntity = await this.todoEntityRepository.findOne(options);
    const response = todoEntity as ITodo;
    return response;
  }

  async update(id: number, data: TodoModel): Promise<TodoModel> {
    data.setUpdatedAt();
    await this.todoEntityRepository.update(id, data);
    return data;
  }

  async delete(id: number): Promise<void> {
    await this.todoEntityRepository.softDelete(id);
  }

  parseEntityToModel(data: TodoEntity | ITodo): TodoModel {
    return new TodoModel(
      data.content,
      data.isDone,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
  }
}
