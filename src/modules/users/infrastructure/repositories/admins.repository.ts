import { Injectable } from '@nestjs/common';
import { IUser } from '../../domain/interfaces/user.interface';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { IAdminsDatabaseRepository } from '../../domain/repositories/admins.interface';
import { IPagination } from 'src/lib/interfaces/pagination.interface';
import { FindAdminUsersCommand } from '../commands/admin/find-admin-users.command';
import { SortType } from 'src/lib/enums/sort-type.enum';
import { Sort } from 'src/lib/enums/sort.enum';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGINATE,
  DEFAULT_PERPAGE,
} from 'config/constants';
import isPaginate from 'src/lib/utils/is-paginate';
import getSkip from 'src/lib/utils/calculate-skip-pagination';
import getTotalPages from 'src/lib/utils/calculate-total-pages';
import { UserModel } from '../../domain/models/user.model';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { UserRoleModel } from '../../domain/models/userRole.model';
import { UserRoleEntity } from '../entities/user-role.entity';
import { formatDateEnd, formatDateStart } from 'src/lib/utils/dates';
import { RecoveryCodeEntity } from 'src/modules/auth/infrastructure/entities/recovery-code.entity';
import { ModulePermissionsEntity } from '../entities/module-permissions.entity';
@Injectable()
export class DatabaseAdminsRepository implements IAdminsDatabaseRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersEntityRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(
    query: FindAdminUsersCommand,
  ): Promise<IUser[] | IPagination<IUser>> {
    const table = 'users';
    const {
      sortType = SortType.CREATED_AT,
      sort = Sort.DESC,
      page = DEFAULT_PAGE,
      perPage = DEFAULT_PERPAGE,
      paginate = DEFAULT_PAGINATE,
      name,
      startDate,
      endDate,
    } = query;

    const queryBuilder: SelectQueryBuilder<UserEntity> =
      this.usersEntityRepository
        .createQueryBuilder(table)
        .leftJoinAndSelect(`${table}.modulePermissions`, 'modulePermissions')
        .orderBy(`${table}.${sortType}`, sort);

    if (name) {
      const nameClean = name.trim();
      if (isNaN(parseInt(nameClean))) {
        queryBuilder.where(`${table}.fullName LIKE :name`, {
          name: `%${nameClean}%`,
        });
      } else {
        queryBuilder.where(
          new Brackets((qb) => {
            qb.where(`${table}.fullName LIKE :name`, {
              name: `%${nameClean}%`,
            }).orWhere(`${table}.id = :name`, { name: parseInt(nameClean) });
          }),
        );
      }
    }
    if (startDate) {
      queryBuilder.andWhere(`${table}.createdAt >= :startDate`, {
        startDate: formatDateStart(startDate),
      });
    }

    if (endDate) {
      queryBuilder.andWhere(`${table}.createdAt <= :endDate`, {
        endDate: formatDateEnd(endDate),
      });
    }

    if (!isPaginate(paginate)) {
      const list = await queryBuilder.getMany();
      return list.map((data) => data as IUser);
    }

    queryBuilder.skip(getSkip(page, perPage)).take(perPage);
    const [items, total] = await queryBuilder.getManyAndCount();

    const response = {
      items: items.map((data) => data as IUser),
      meta: {
        totalItems: total,
        itemsPerPage: perPage,
        totalPages: getTotalPages(total, perPage),
        currentPage: page,
      },
    };
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

  async delete(id: number): Promise<void> {
    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.delete(UserRoleEntity, { userId: id });
      await transactionalEntityManager.delete(RecoveryCodeEntity, {
        userId: id,
      });
      await transactionalEntityManager.delete(ModulePermissionsEntity, {
        userId: id,
      });
      await transactionalEntityManager.delete(UserEntity, id);
    });
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
