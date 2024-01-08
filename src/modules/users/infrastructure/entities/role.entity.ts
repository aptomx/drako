import { UserRoleEntity } from './user-role.entity';
import {
  Column,
  CreatedAt,
  DataType,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { IRole } from '../../domain/interfaces/role.interface';

@Table({ modelName: 'roles' })
export class RoleEntity extends Model<IRole> {
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

  @HasMany(() => UserRoleEntity)
  userRoles: UserRoleEntity[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
