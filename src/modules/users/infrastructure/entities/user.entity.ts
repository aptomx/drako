import { IUser } from '../../domain/interfaces/user.interface';
import {
  CreateDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { ModulePermissionsEntity } from './module-permissions.entity';
import { UserRoleEntity } from './user-role.entity';
import { RecoveryCodeEntity } from 'src/modules/auth/infrastructure/entities/recovery-code.entity';

@Entity('users')
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', generated: 'uuid', unique: true })
  uuid: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  password: string;

  @Column({ type: 'varchar', length: 255 })
  firstName: string;

  @Column({ type: 'varchar', length: 255 })
  lastName: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'text', nullable: true })
  photo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  driver: string;

  @Column({ type: 'text', unique: true, nullable: true })
  token: string;

  @OneToOne(() => UserRoleEntity, (userRole) => userRole.user)
  userRole: UserRoleEntity;

  @OneToMany(
    () => ModulePermissionsEntity,
    (modulePermission) => modulePermission.user,
  )
  modulePermissions: ModulePermissionsEntity[];

  @OneToMany(() => RecoveryCodeEntity, (recoveryCode) => recoveryCode.user)
  recoveryCodes: RecoveryCodeEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
