import { BaseEntity } from 'src/lib/abstracts/base.abstract';
import { AuthLogStatus } from '../enums/auth-log-status.enum';

export interface IAuthLog extends BaseEntity {
  email: string;
  ip: string;
  userAgent: string;
  status: AuthLogStatus;
  error: string | null;
  timestamp: Date;
}
