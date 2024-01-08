import { AuthLogStatus } from '../../domain/enums/auth-log-status.enum';
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { IAuthLog } from '../../domain/interfaces/auth-logs.interface';

@Table({ modelName: 'auth_logs' })
export class AuthLogsEntity extends Model<IAuthLog> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
  })
  ip: string;

  @Column({
    type: DataType.STRING,
  })
  userAgent: string;

  @Column({
    type: DataType.ENUM(...Object.values(AuthLogStatus)),
  })
  status: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  error: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
