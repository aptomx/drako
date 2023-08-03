import { BaseEntity } from 'src/lib/abstracts/base.abstract';

export interface ITodoWithUsersDummy extends BaseEntity {
  content: string;
  isDone: boolean;
  users: number[];
}
