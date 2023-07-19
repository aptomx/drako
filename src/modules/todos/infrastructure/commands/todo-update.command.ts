import { PickType } from '@nestjs/swagger';
import { TodoCommand } from './todo.command';

export class TodoUpdateCommand extends PickType(TodoCommand, [
  'isDone',
] as const) {}
