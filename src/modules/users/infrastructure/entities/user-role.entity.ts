import {
  CreateDateColumn,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { IUserRole } from '../../domain/interfaces/user-role.interface';
import { UserEntity } from './user.entity';
import { RoleEntity } from './role.entity';

@Entity('user_roles')
export class UserRoleEntity implements IUserRole {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'integer' })
  userId: number;

  @Column({ type: 'integer' })
  roleId: number;

  @OneToOne(() => UserEntity, (user) => user.userRole)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRoles)
  role: RoleEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
