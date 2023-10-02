import { AuthLogStatus } from '../../../../modules/auth/domain/enums/auth-log-status.enum';

export interface IAuthLogMessage {
  email: string;
  ip: string;
  userAgent: string;
  status: AuthLogStatus;
  error: string | null;
}
