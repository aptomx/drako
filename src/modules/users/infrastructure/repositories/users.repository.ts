import { Injectable } from '@nestjs/common';
import { IUsersDatabaseRepository } from '../../domain/repositories/users.interface';
import { IUser } from '../../domain/interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';
import { UserModel } from '../../domain/models/user.model';
import { UserRoleEntity } from '../entities/user-role.entity';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { IRole } from '../../domain/interfaces/role.interface';
import { RoleEntity } from '../entities/role.entity';

@Injectable()
export class DatabaseUsersRepository implements IUsersDatabaseRepository {
  constructor(
    @InjectModel(UserEntity)
    private readonly usersEntityRepository: typeof UserEntity,
    @InjectModel(UserRoleEntity)
    private readonly userRoleEntityRepository: typeof UserRoleEntity,
    @InjectModel(RoleEntity)
    private readonly roleEntityRepository: typeof RoleEntity,
  ) {}

  async findOne(id: number): Promise<IUser> {
    const userEntity = await this.usersEntityRepository.findOne({
      where: { id },
      include: [
        {
          model: this.userRoleEntityRepository,
        },
      ],
    });
    return userEntity as IUser;
  }

  async findOneByEmail(email: string): Promise<IUser> {
    const userEntity = await this.usersEntityRepository.findOne({
      where: { email },
      include: [
        {
          model: this.userRoleEntityRepository,
          include: [
            {
              model: this.roleEntityRepository,
            },
          ],
        },
      ],
    });
    return userEntity as IUser;
  }

  async findOneByEmailNotId(userId: number, email: string): Promise<IUser> {
    const userEntity = await this.usersEntityRepository.findOne({
      where: { email, id: { [Op.not]: userId } },
      include: [
        {
          model: this.userRoleEntityRepository,
        },
      ],
    });
    return userEntity as IUser;
  }

  async update(id: number, data: UserModel): Promise<IUser> {
    data.setUpdatedAt();
    await this.usersEntityRepository.update(data, { where: { id } });
    return data as IUser;
  }

  async findRole(roleName: string): Promise<IRole> {
    const role = await this.roleEntityRepository.findOne({
      where: { name: roleName },
    });

    return role as IRole;
  }
}
