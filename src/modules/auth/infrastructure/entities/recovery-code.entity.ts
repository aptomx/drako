import {
  CreateDateColumn,
  Entity,
  Column,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../../users/infrastructure/entities/user.entity';
import { IRecoveryCode } from '../../domain/interfaces/recovery-code.interface';
import { RecoveryCodeTypes } from '../../domain/enums/recovery-code.enum';

@Entity('recovery_codes')
export class RecoveryCodeEntity implements IRecoveryCode {
  @PrimaryGeneratedColumn({ type: 'integer' })
  id: number;

  @Column({ type: 'varchar', length: 255 })
  code: string;

  @Column({ type: 'text', nullable: true })
  token: string;

  @Column({ type: 'varchar', length: 255 })
  type: RecoveryCodeTypes;

  @Column({ type: 'integer' })
  userId: number;

  @ManyToOne(() => UserEntity, (user) => user.recoveryCodes)
  user: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
