import { BaseEntity } from 'src/lib/abstracts/base.abstract';
import { RecoveryCodeTypes } from '../enums/recovery-code.enum';

export interface IRecoveryCode extends BaseEntity {
  code: string;
  token: string;
  type: RecoveryCodeTypes;
  userId: number;
}
