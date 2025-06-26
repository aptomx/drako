import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGINATE,
  DEFAULT_PERPAGE,
} from 'config/constants';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Sort } from 'src/lib/enums/sort.enum';
import { SortType } from 'src/lib/enums/sort-type.enum';
import { UserRoles } from 'src/lib/enums/user-roles.enum';
import { IPagination } from 'src/lib/interfaces/pagination.interface';
import getSkip from 'src/lib/utils/calculate-skip-pagination';
import getTotalPages from 'src/lib/utils/calculate-total-pages';
import { formatDateEnd, formatDateStart } from 'src/lib/utils/dates';
import isPaginate from 'src/lib/utils/is-paginate';
import { RecoveryCodeEntity } from 'src/modules/auth/infrastructure/entities/recovery-code.entity';
import {
  conditionLike,
  conditionLikeNumber,
} from '../../../../lib/utils/sequelize/conditions-sequelize';
import { IModule } from '../../domain/interfaces/module.interface';
import { IUser } from '../../domain/interfaces/user.interface';
import { ModulePermissionsModel } from '../../domain/models/module-permissions.model';
import { UserModel } from '../../domain/models/user.model';
import { UserRoleModel } from '../../domain/models/userRole.model';
import { IAdminsDatabaseRepository } from '../../domain/repositories/admins.interface';
import { FindAdminUsersCommand } from '../commands/admin/find-admin-users.command';
import { ModuleEntity } from '../entities/module.entity';
import { ModulePermissionsEntity } from '../entities/module-permissions.entity';
import { UserEntity } from '../entities/user.entity';
import { UserRoleEntity } from '../entities/user-role.entity';

@Injectable()
export class DatabaseAdminsRepository implements IAdminsDatabaseRepository {
  constructor(
    @InjectModel(UserEntity)
    private readonly usersEntityRepository: typeof UserEntity,
    @InjectModel(UserRoleEntity)
    private readonly userRoleEntityRepository: typeof UserRoleEntity,
    @InjectModel(RecoveryCodeEntity)
    private readonly recoveryCodeEntityRepository: typeof RecoveryCodeEntity,
    @InjectModel(ModulePermissionsEntity)
    private readonly modulePermissionsEntityRepository: typeof ModulePermissionsEntity,
    @InjectModel(ModuleEntity)
    private readonly moduleEntityRepository: typeof ModuleEntity,
    private readonly sequelize: Sequelize,
  ) {}

  async findAll(
    query: FindAdminUsersCommand,
  ): Promise<IUser[] | IPagination<IUser>> {
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

    let queryWhere = {};

    if (name) {
      queryWhere = {
        ...queryWhere,
        [Op.or]: [
          { fullName: conditionLike('fullName', name) },
          { id: conditionLikeNumber('id', name) },
        ],
      };
    }

    if (startDate && endDate) {
      queryWhere = {
        ...queryWhere,
        [Op.and]: [
          { createdAt: { [Op.gte]: formatDateStart(startDate) } },
          { createdAt: { [Op.lte]: formatDateEnd(endDate) } },
        ],
      };
    }

    if (!isPaginate(paginate)) {
      const list = await this.usersEntityRepository.findAll({
        where: queryWhere,
      });
      return list.map((data) => data as IUser);
    }

    const { rows, count } = await this.usersEntityRepository.findAndCountAll({
      where: queryWhere,
      order: [[sortType, sort]],
      limit: perPage,
      offset: getSkip(page, perPage),
      include: [
        {
          model: this.modulePermissionsEntityRepository,
          separate: true, // If not used, count includes each one as a record
        },
      ],
    });

    return {
      items: rows.map((data) => data as IUser),
      meta: {
        totalItems: count,
        itemsPerPage: perPage,
        totalPages: getTotalPages(count, perPage),
        currentPage: page,
      },
    };
  }

  async create(
    data: UserModel,
    roleId: UserRoles,
    permissions: ModulePermissionsModel[],
  ): Promise<IUser> {
    let userEntity;

    await this.sequelize.transaction(async (t) => {
      userEntity = await this.usersEntityRepository.create(data, {
        transaction: t,
      });

      const userRole = new UserRoleModel(roleId, userEntity.id);
      await this.userRoleEntityRepository.create(userRole, { transaction: t });

      permissions.forEach((p) => {
        p.userId = userEntity.id;
      });
      await this.modulePermissionsEntityRepository.bulkCreate(permissions, {
        transaction: t,
      });
    });

    return userEntity as IUser;
  }

  async update(
    id: number,
    data: UserModel,
    permissions?: ModulePermissionsModel[],
  ): Promise<IUser> {
    data.setUpdatedAt();
    if (permissions) {
      await this.modulePermissionsEntityRepository.destroy({
        where: { userId: id },
      });
      permissions.forEach((p) => {
        p.userId = id;
      });
      await this.modulePermissionsEntityRepository.bulkCreate(permissions);
    }
    await this.usersEntityRepository.update(data, { where: { id } });
    return data as IUser;
  }

  async findOneModulePermission(id: number): Promise<IModule> {
    const moduleEntity = await this.moduleEntityRepository.findOne({
      where: { id },
    });
    return moduleEntity as IModule;
  }

  async delete(id: number): Promise<void> {
    await this.sequelize.transaction(async (t) => {
      await this.userRoleEntityRepository.destroy({
        where: { userId: id },
        transaction: t,
      });

      await this.recoveryCodeEntityRepository.destroy({
        where: { userId: id },
        transaction: t,
      });

      await this.modulePermissionsEntityRepository.destroy({
        where: { userId: id },
        transaction: t,
      });

      await this.usersEntityRepository.destroy({
        where: { id },
        transaction: t,
      });
    });
  }
}
