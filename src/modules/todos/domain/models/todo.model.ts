import { getRandomAlphanumeric } from 'src/lib/utils/ramdom-string';
import { ITodo } from '../interfaces/todos.interface';

export class TodoModel implements ITodo {
  content: string;

  isDone: boolean;

  id: number;

  createdAt: Date;

  updatedAt: Date;

  constructor(
    content: string,
    isDone: boolean,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.content = content;
    this.isDone = isDone;
    this.id = id ? id : 0;
    this.createdAt = createdAt ? createdAt : new Date();
    this.updatedAt = updatedAt ? updatedAt : new Date();
  }

  isEditable() {
    return this.isDone === false;
  }

  setUpdatedAt() {
    const date = new Date();
    this.updatedAt = date;
    return date;
  }

  setRandomTitle() {
    this.content = getRandomAlphanumeric(10);
  }

  setIsDone(isDone) {
    this.isDone = isDone;
  }
}
