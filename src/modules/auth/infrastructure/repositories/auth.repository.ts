import { Injectable } from '@nestjs/common';
import { IAuthDatabaseRepository } from '../../domain/repositories/auth.interface';
import { RecoveryCodeEntity } from '../entities/recovery-code.entity';
import { RecoveryCodeModel } from '../../domain/models/recovery-code.model';
import { RecoveryCodeTypes } from '../../domain/enums/recovery-code.enum';
import { IRecoveryCode } from '../../domain/interfaces/recovery-code.interface';
import { Sort } from 'src/lib/enums/sort.enum';
import { UserEntity } from '../../../users/infrastructure/entities/user.entity';
import { InjectModel } from '@nestjs/sequelize';

@Injectable()
export class DatabaseAuthRepository implements IAuthDatabaseRepository {
  constructor(
    @InjectModel(RecoveryCodeEntity)
    private readonly recoveryCodeEntityRepository: typeof RecoveryCodeEntity,
    @InjectModel(UserEntity)
    private readonly userEntityRepository: typeof UserEntity,
  ) {}

  async createRecoveryCode(data: RecoveryCodeModel): Promise<IRecoveryCode> {
    const recoveryCode = await this.recoveryCodeEntityRepository.create(data);
    return recoveryCode as IRecoveryCode;
  }

  async updateRecoveryCode(
    id: number,
    data: RecoveryCodeModel,
  ): Promise<IRecoveryCode> {
    data.setUpdatedAt();
    await this.recoveryCodeEntityRepository.update(data, { where: { id } });
    return data as IRecoveryCode;
  }

  async findLastRecoveryCode(
    email: string,
    code: string,
    type: RecoveryCodeTypes,
  ): Promise<IRecoveryCode> {
    const recoveryCodeEntity = await this.recoveryCodeEntityRepository.findOne({
      where: { code, type },
      order: [['id', Sort.DESC]],
      include: [
        {
          model: this.userEntityRepository,
          where: { email },
        },
      ],
    });
    return recoveryCodeEntity as IRecoveryCode;
  }

  async findRecoveryCodeByToken(token: string): Promise<IRecoveryCode> {
    const recoveryCodeEntity = await this.recoveryCodeEntityRepository.findOne({
      where: { token },
      include: [
        {
          model: this.userEntityRepository,
        },
      ],
    });
    return recoveryCodeEntity as IRecoveryCode;
  }

  async findRecoveryCodeById(id: number): Promise<IRecoveryCode> {
    const recoveryCodeEntity = await this.recoveryCodeEntityRepository.findOne({
      where: { id },
    });
    return recoveryCodeEntity as IRecoveryCode;
  }
}
