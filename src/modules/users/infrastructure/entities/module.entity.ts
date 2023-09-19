import { IModule } from '../../domain/interfaces/module.interface';
import {
  CreateDateColumn,
  Entity,
  Column,
  UpdateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ModulePermissionsEntity } from './module-permissions.entity';

@Entity('modules')
export class ModuleEntity implements IModule {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(
    () => ModulePermissionsEntity,
    (modulePermission) => modulePermission.module,
  )
  modulePermissions: ModulePermissionsEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
