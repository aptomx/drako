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
import { IUserRole } from '../../domain/interfaces/user-role.interface';
import { RoleEntity } from './role.entity';
import { UserEntity } from './user.entity';

@Table({ tableName: 'user_roles' })
export class UserRoleEntity extends Model<IUserRole> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => UserEntity)
  @Column({
    type: DataType.INTEGER,
  })
  userId: number;

  @ForeignKey(() => RoleEntity)
  @Column({
    type: DataType.INTEGER,
  })
  roleId: number;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @BelongsTo(() => RoleEntity)
  role: RoleEntity;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
