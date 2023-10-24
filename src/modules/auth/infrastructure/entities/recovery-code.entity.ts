import { UserEntity } from '../../../users/infrastructure/entities/user.entity';
import { RecoveryCodeTypes } from '../../domain/enums/recovery-code.enum';
import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { IRecoveryCode } from '../../domain/interfaces/recovery-code.interface';

@Table({ modelName: 'recovery_codes' })
export class RecoveryCodeEntity extends Model<IRecoveryCode> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  code: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  token: string;

  @Column({
    type: DataType.ENUM(...Object.values(RecoveryCodeTypes)),
    allowNull: true,
  })
  type: RecoveryCodeTypes;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
