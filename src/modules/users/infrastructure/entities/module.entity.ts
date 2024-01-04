import { ModulePermissionsEntity } from './module-permissions.entity';
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { IModule } from '../../domain/interfaces/module.interface';

@Table({ modelName: 'modules' })
export class ModuleEntity extends Model<IModule> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @HasMany(() => ModulePermissionsEntity)
  modulePermissions: ModulePermissionsEntity[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
