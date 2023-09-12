import { RecoveryCodeModel } from '../models/recovery-code.model';
import { RecoveryCodeTypes } from '../enums/recovery-code.enum';
import { IRecoveryCode } from '../interfaces/recovery-code.interface';
import { RecoveryCodeEntity } from '../../infrastructure/entities/recovery-code.entity';

export interface IAuthDatabaseRepository {
  createRecoveryCode(data: RecoveryCodeModel): Promise<RecoveryCodeModel>;
  updateRecoveryCode(
    id: number,
    data: RecoveryCodeModel,
  ): Promise<RecoveryCodeModel>;
  findLastRecoveryCode(
    email: string,
    code: string,
    type: RecoveryCodeTypes,
  ): Promise<IRecoveryCode>;
  findRecoveryCodeByToken(token: string): Promise<IRecoveryCode>;
  findRecoveryCodeById(id: number): Promise<IRecoveryCode>;
  parseEntityToModel(
    data: RecoveryCodeEntity | IRecoveryCode,
  ): RecoveryCodeModel;
}

export const IAuthDatabaseRepository = Symbol('IAuthDatabaseRepository');
