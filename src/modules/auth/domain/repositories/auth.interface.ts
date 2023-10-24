import { RecoveryCodeModel } from '../models/recovery-code.model';
import { RecoveryCodeTypes } from '../enums/recovery-code.enum';
import { IRecoveryCode } from '../interfaces/recovery-code.interface';

export interface IAuthDatabaseRepository {
  createRecoveryCode(data: RecoveryCodeModel): Promise<IRecoveryCode>;
  updateRecoveryCode(
    id: number,
    data: RecoveryCodeModel,
  ): Promise<IRecoveryCode>;
  findLastRecoveryCode(
    email: string,
    code: string,
    type: RecoveryCodeTypes,
  ): Promise<IRecoveryCode>;
  findRecoveryCodeByToken(token: string): Promise<IRecoveryCode>;
  findRecoveryCodeById(id: number): Promise<IRecoveryCode>;
}

export const IAuthDatabaseRepository = Symbol('IAuthDatabaseRepository');
