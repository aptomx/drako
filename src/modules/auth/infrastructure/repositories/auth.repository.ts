import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IAuthDatabaseRepository } from '../../domain/repositories/auth.interface';
import { RecoveryCodeEntity } from '../entities/recovery-code.entity';
import { RecoveryCodeModel } from '../../domain/models/recovery-code.model';
import { RecoveryCodeTypes } from '../../domain/enums/recovery-code.enum';
import { IRecoveryCode } from '../../domain/interfaces/recovery-code.interface';
import { Sort } from 'src/lib/enums/sort.enum';

@Injectable()
export class DatabaseAuthRepository implements IAuthDatabaseRepository {
  constructor(
    @InjectRepository(RecoveryCodeEntity)
    private readonly recoveryCodeEntityRepository: Repository<RecoveryCodeEntity>,
  ) {}

  async createRecoveryCode(
    data: RecoveryCodeModel,
  ): Promise<RecoveryCodeModel> {
    await this.recoveryCodeEntityRepository.save(data);
    return data;
  }

  async updateRecoveryCode(
    id: number,
    data: RecoveryCodeModel,
  ): Promise<RecoveryCodeModel> {
    data.setUpdatedAt();
    await this.recoveryCodeEntityRepository.update(id, data);
    return data;
  }

  async findLastRecoveryCode(
    email: string,
    code: string,
    type: RecoveryCodeTypes,
  ): Promise<IRecoveryCode> {
    const recoveryCodeEntity = await this.recoveryCodeEntityRepository.findOne({
      where: { code, type, user: { email } },
      order: {
        id: Sort.DESC,
      },
      relations: {
        user: true,
      },
    });
    const response = recoveryCodeEntity as IRecoveryCode;
    return response;
  }

  async findRecoveryCodeByToken(token: string): Promise<IRecoveryCode> {
    const recoveryCodeEntity = await this.recoveryCodeEntityRepository.findOne({
      where: { token },
      relations: {
        user: true,
      },
    });
    const response = recoveryCodeEntity as IRecoveryCode;
    return response;
  }

  async findRecoveryCodeById(id: number): Promise<IRecoveryCode> {
    const recoveryCodeEntity = await this.recoveryCodeEntityRepository.findOne({
      where: { id },
    });
    const response = recoveryCodeEntity as IRecoveryCode;
    return response;
  }

  parseEntityToModel(
    data: RecoveryCodeEntity | IRecoveryCode,
  ): RecoveryCodeModel {
    const user = new RecoveryCodeModel(
      data.code,
      data.token,
      data.type,
      data.userId,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
    return user;
  }
}
