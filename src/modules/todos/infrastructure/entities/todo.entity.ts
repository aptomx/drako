import { ITodo } from '../../domain/interfaces/todos.interface';
import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  DataType,
  Model,
} from 'sequelize-typescript';

@Table({ tableName: 'todos' })
export class TodoEntity extends Model<ITodo> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  content: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDone: boolean;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
