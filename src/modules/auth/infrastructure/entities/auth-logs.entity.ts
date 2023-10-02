import {
  CreateDateColumn,
  Entity,
  Column,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IAuthLog } from '../../domain/interfaces/auth-logs.interface';
import { AuthLogStatus } from '../../domain/enums/auth-log-status.enum';

@Entity('auth_logs')
export class AuthLogsEntity implements IAuthLog {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  ip: string;

  @Column({ type: 'varchar', length: 255 })
  userAgent: string;

  @Column({ type: 'varchar', length: 255 })
  status: AuthLogStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  error: string;

  @CreateDateColumn()
  timestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
