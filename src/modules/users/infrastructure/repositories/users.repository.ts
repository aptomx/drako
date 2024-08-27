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
import { UserRoleModel } from '../../domain/models/userRole.model';
import { Sequelize } from 'sequelize-typescript';
import { ModulePermissionsEntity } from '../entities/module-permissions.entity';
import { ModuleEntity } from '../entities/module.entity';
@Injectable()
export class DatabaseUsersRepository implements IUsersDatabaseRepository {
  constructor(
    @InjectModel(UserEntity)
    private readonly usersEntityRepository: typeof UserEntity,
    @InjectModel(UserRoleEntity)
    private readonly userRoleEntityRepository: typeof UserRoleEntity,
    @InjectModel(RoleEntity)
    private readonly roleEntityRepository: typeof RoleEntity,
    @InjectModel(ModulePermissionsEntity)
    private readonly modulePermissionsEntityRepository: typeof ModulePermissionsEntity,
    @InjectModel(ModuleEntity)
    private readonly moduleEntityRepository: typeof ModuleEntity,
    private readonly sequelize: Sequelize,
  ) {}

  async findOne(id: number): Promise<IUser> {
    const userEntity = await this.usersEntityRepository.findOne({
      where: { id },
      include: [
        {
          model: this.userRoleEntityRepository,
        },
        {
          model: this.modulePermissionsEntityRepository,
          include: [
            {
              model: this.moduleEntityRepository,
            },
          ],
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

  async create(data: UserModel, roleId: number): Promise<IUser> {
    let userEntity;

    await this.sequelize.transaction(async (t) => {
      userEntity = await this.usersEntityRepository.create(data, {
        transaction: t,
      });

      const userRole = new UserRoleModel(roleId, userEntity.id);
      await this.userRoleEntityRepository.create(userRole, { transaction: t });
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
