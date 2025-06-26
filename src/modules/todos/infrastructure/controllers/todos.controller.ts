import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BASE_PREFIX_API } from 'config/magicVariables';
import { SWAGGER_SUMMARY_BASIC } from 'config/messageResponses';
import { IPagination } from 'src/lib/interfaces/pagination.interface';
import { ITodo } from '../../domain/interfaces/todos.interface';
import { TodosService } from '../../domain/services/todos.service';
import { TodoCommand } from '../commands/todo.command';
import { TodoSearchCommand } from '../commands/todo-search.command';
import { TodoUpdateCommand } from '../commands/todo-update.command';

@Controller(`${BASE_PREFIX_API}/todos`)
export class TodosController {
  constructor(private todosService: TodosService) {}

  @ApiTags('Todos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Return new register',
  })
  @Post()
  async create(@Body() data: TodoCommand): Promise<ITodo> {
    return await this.todosService.create(data);
  }

  @ApiTags('Todos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return simple list',
  })
  @Get()
  async findAll(
    @Query() query: TodoSearchCommand,
  ): Promise<ITodo[] | IPagination<ITodo>> {
    return await this.todosService.findAll(query);
  }

  @ApiTags('Todos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return detail',
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<ITodo> {
    return await this.todosService.findOne(id);
  }

  @ApiTags('Todos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SWAGGER_SUMMARY_BASIC,
  })
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: TodoUpdateCommand,
  ): Promise<ITodo> {
    await this.todosService.findOne(id);
    return await this.todosService.update(id, data.isDone);
  }

  @ApiTags('Todos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SWAGGER_SUMMARY_BASIC,
  })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<ITodo> {
    const data = await this.todosService.findOne(id);
    await this.todosService.remove(id);
    return data;
  }
}
