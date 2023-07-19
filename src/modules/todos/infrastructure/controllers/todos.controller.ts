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
} from '@nestjs/common';
import { BASE_PREFIX_API } from 'config/magicVariables';
import { TodosService } from '../../domain/services/todos.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TodoCommand } from '../commands/todo.command';
import { TodoModel } from '../../domain/models/todo.model';
import { SWAGGER_SUMMARY_BASIC } from 'config/messageResponses';
import { TodoUpdateCommand } from '../commands/todo-update.command';
import { IDisplayMessageSuccess } from 'src/lib/interfaces/display-message-success.interface';

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
  async create(@Body() data: TodoCommand): Promise<TodoModel> {
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
  async findAll(): Promise<TodoModel[]> {
    return await this.todosService.findAll();
  }

  @ApiTags('Todos')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Test' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return detail',
  })
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<TodoModel> {
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
  ): Promise<IDisplayMessageSuccess> {
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
  async remove(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IDisplayMessageSuccess> {
    await this.todosService.findOne(id);
    return await this.todosService.remove(id);
  }
}
