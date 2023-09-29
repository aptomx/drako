import { Injectable } from '@nestjs/common';
import { IUsersDatabaseRepository } from '../../domain/repositories/users.interface';
import { IUser } from '../../domain/interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Not, Repository } from 'typeorm';
import { UserModel } from '../../domain/models/user.model';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { UserRoleModel } from '../../domain/models/userRole.model';
import { UserRoleEntity } from '../entities/user-role.entity';
@Injectable()
export class DatabaseUsersRepository implements IUsersDatabaseRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersEntityRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findOne(id: number): Promise<IUser> {
    const userEntity = await this.usersEntityRepository.findOne({
      where: { id },
      relations: {
        userRole: true,
      },
    });
    const response = userEntity as IUser;
    return response;
  }

  async findOneByEmail(email: string): Promise<IUser> {
    const userEntity = await this.usersEntityRepository.findOne({
      where: { email },
      relations: {
        userRole: true,
      },
    });
    const response = userEntity as IUser;
    return response;
  }

  async findOneByEmailNotId(userId: number, email: string): Promise<IUser> {
    const userEntity = await this.usersEntityRepository.findOne({
      where: { email, id: Not(userId) },
      relations: {
        userRole: true,
      },
    });
    const response = userEntity as IUser;
    return response;
  }

  async create(data: UserModel, roleId: UserRoles): Promise<UserModel> {
    let userEntity;

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      userEntity = await transactionalEntityManager.save(UserEntity, data);

      const userRole = new UserRoleModel(roleId, userEntity.id);
      await transactionalEntityManager.save(UserRoleEntity, userRole);
    });

    return userEntity
      ? this.parseEntityToModel(userEntity)
      : (userEntity as UserEntity);
  }

  async update(id: number, data: UserModel): Promise<UserModel> {
    data.setUpdatedAt();
    await this.usersEntityRepository.update(id, data);
    return data;
  }

  parseEntityToModel(data: UserEntity | IUser): UserModel {
    const user = new UserModel(
      data.email,
      data.firstName,
      data.lastName,
      data.isActive,
      data.emailVerified,
      data.password,
      data.photo,
      data.phone,
      data.driver,
      data.token,
      data.id,
      data.createdAt,
      data.updatedAt,
    );
    return user;
  }
}
