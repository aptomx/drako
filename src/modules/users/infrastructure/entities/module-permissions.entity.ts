import { UserEntity } from './user.entity';
import { ModuleEntity } from './module.entity';
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
import { IModulePermission } from '../../domain/interfaces/module-permission.interface';

@Table({ tableName: 'module_permissions' })
export class ModulePermissionsEntity extends Model<IModulePermission> {
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

  @ForeignKey(() => ModuleEntity)
  @Column({
    type: DataType.INTEGER,
  })
  moduleId: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  view: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  edit: boolean;

  @BelongsTo(() => UserEntity)
  user: UserEntity;

  @BelongsTo(() => ModuleEntity)
  module: ModuleEntity;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
