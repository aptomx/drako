import { BaseEntity } from 'src/lib/abstracts/base.abstract';

export interface ITodo extends BaseEntity {
  content: string;

  isDone: boolean;
}
