import { Injectable } from '@nestjs/common';
import { TodoModel } from '../../domain/models/todo.model';
import { ITodoDatabaseRepository } from '../../domain/repositories/todo.interface';
import { TodoEntity } from '../entities/todo.entity';
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
import getTotalPages from 'src/lib/utils/calculate-total-pages';
import { InjectModel } from '@nestjs/sequelize';
import getSkip from '../../../../lib/utils/calculate-skip-pagination';
import isPaginate from '../../../../lib/utils/is-paginate';

@Injectable()
export class DatabaseTodoRepository implements ITodoDatabaseRepository {
  constructor(
    @InjectModel(TodoEntity)
    private readonly todoEntityRepository: typeof TodoEntity,
  ) {}

  async create(todo: TodoModel): Promise<ITodo> {
    const createdTodo = await this.todoEntityRepository.create(todo);
    return createdTodo as ITodo;
  }

  async findAll(
    query: TodoSearchCommand,
  ): Promise<ITodo[] | IPagination<ITodo>> {
    const {
      sortType = SortType.CREATED_AT,
      sort = Sort.DESC,
      page = DEFAULT_PAGE,
      perPage = DEFAULT_PERPAGE,
      paginate = DEFAULT_PAGINATE,
    } = query;

    if (!isPaginate(paginate)) {
      const list = await this.todoEntityRepository.findAll();

      return list.map((data) => data as ITodo);
    }

    const { rows, count } = await this.todoEntityRepository.findAndCountAll({
      order: [[sortType, sort]],
      limit: perPage,
      offset: getSkip(page, perPage),
    });

    return {
      items: rows.map((data) => data as ITodo),
      meta: {
        totalItems: count,
        itemsPerPage: perPage,
        totalPages: getTotalPages(count, perPage),
        currentPage: page,
      },
    };
  }

  async findOne(id: number): Promise<ITodo> {
    const todoEntity = await this.todoEntityRepository.findOne({
      where: { id },
    });
    return todoEntity as ITodo;
  }

  async update(id: number, data: TodoModel): Promise<ITodo> {
    data.setUpdatedAt();
    await this.todoEntityRepository.update(data, { where: { id } });
    return data as ITodo;
  }

  async delete(id: number): Promise<void> {
    await this.todoEntityRepository.destroy({ where: { id } });
  }
}
