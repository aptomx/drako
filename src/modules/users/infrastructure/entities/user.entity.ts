import { ModulePermissionsEntity } from './module-permissions.entity';
import { UserRoleEntity } from './user-role.entity';
import { RecoveryCodeEntity } from 'src/modules/auth/infrastructure/entities/recovery-code.entity';
import {
  DataType,
  Model,
  Table,
  Column,
  HasOne,
  CreatedAt,
  UpdatedAt,
  HasMany,
} from 'sequelize-typescript';
import { IUser } from '../../domain/interfaces/user.interface';

@Table({ modelName: 'users' })
export class UserEntity extends Model<IUser> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Column({
    type: DataType.UUID,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  uuid: string;

  @Column({
    type: DataType.STRING,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.STRING,
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
  })
  lastName: string;

  @Column({
    type: DataType.STRING,
  })
  fullName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.BOOLEAN,
  })
  isActive: boolean;

  @Column({
    type: DataType.BOOLEAN,
  })
  emailVerified: boolean;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  photo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  driver: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  token: string;

  @HasOne(() => UserRoleEntity)
  userRole: UserRoleEntity;

  @HasMany(() => ModulePermissionsEntity)
  modulePermissions: ModulePermissionsEntity[];

  @HasMany(() => RecoveryCodeEntity)
  recoveryCodes: RecoveryCodeEntity[];

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}
