import { RecoveryCodeTypes } from '../enums/recovery-code.enum';
import { IRecoveryCode } from '../interfaces/recovery-code.interface';

export class RecoveryCodeModel implements IRecoveryCode {
  id: number;

  code: string;

  token: string;

  type: RecoveryCodeTypes;

  userId: number;

  createdAt: Date;

  updatedAt: Date;

  constructor(
    code: string,
    token: string,
    type: RecoveryCodeTypes,
    userId: number,
    id?: number,
    createdAt?: Date,
    updatedAt?: Date,
  ) {
    this.code = code;
    this.token = token;
    this.type = type;
    this.userId = userId;
    this.id = id;
    this.createdAt = createdAt ? new Date(createdAt) : undefined;
    this.updatedAt = updatedAt ? new Date(updatedAt) : undefined;
  }

  setUpdatedAt?() {
    const date = new Date();
    this.updatedAt = date;
    return date;
  }

  updateToken?(value: string) {
    this.token = value;
  }
}
