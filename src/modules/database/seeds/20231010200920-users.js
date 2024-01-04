'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkInsert(
        'users',
        [
          {
            uuid: '374cff85-0936-44cd-8dbe-3bf68704efbe',
            email: 'admin@admin.mx',
            password:
              '$2b$10$tF1MbCtztSIM7WRu/E5Fve6krcIiEn0XlpYfpOqnDTMe3Tr7uv8sa',
            firstName: 'Admin',
            lastName: 'Apto',
            fullName: 'Apto Admin',
            emailVerified: true,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        { transaction: t },
      );

      const adminUser = await queryInterface.select(null, 'users', {
        where: { email: 'admin@admin.mx' },
        transaction: t,
      });

      const adminRole = await queryInterface.select(null, 'roles', {
        where: { name: 'Admin' },
        transaction: t,
      });

      await queryInterface.insert(
        null,
        'user_roles',
        {
          roleId: adminRole[0].id,
          userId: adminUser[0].id,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { transaction: t },
      );

      const modules = await queryInterface.select(null, 'modules', {
        transaction: t,
      });

      const permissions = modules.map((module) => {
        return {
          id: module.id,
          userId: adminUser[0].id,
          moduleId: module.id,
          view: true,
          edit: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      });

      await queryInterface.bulkInsert('module_permissions', permissions, {
        transaction: t,
      });
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      const adminUser = await queryInterface.select(null, 'users', {
        where: { email: 'admin@admin.mx' },
        transaction: t,
      });

      await queryInterface.bulkDelete(
        'module_permissions',
        { userId: adminUser[0].id },
        { transaction: t },
      );

      await queryInterface.bulkDelete(
        'user_roles',
        { userId: adminUser[0].id },
        { transaction: t },
      );

      await queryInterface.bulkDelete(
        'users',
        { id: adminUser[0].id },
        { transaction: t },
      );
    });
  },
};
