import {
  CreateDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { IModulePermission } from '../../domain/interfaces/module-permission.interface';
import { UserEntity } from './user.entity';
import { ModuleEntity } from './module.entity';

@Entity('module_permissions')
export class ModulePermissionsEntity implements IModulePermission {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  moduleId: number;

  @Column({ type: 'boolean', default: false })
  view: boolean;

  @Column({ type: 'boolean', default: false })
  edit: boolean;

  @ManyToOne(() => UserEntity, (user) => user.modulePermissions)
  user: UserEntity;

  @ManyToOne(() => ModuleEntity, (module) => module.modulePermissions)
  module: ModuleEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
