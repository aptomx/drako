'use strict';

/** @type {import('sequelize-cli').Migration} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const updateSequence = require('../scripts/update-sequence');

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      const users = [
        {
          id: 1,
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
      ];
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const userId = await queryInterface.rawSelect(
          'users',
          {
            where: { id: user.id },
          },
          ['id'],
        );
        if (!userId) {
          await queryInterface.bulkInsert('users', [user], { transaction: t });
          await queryInterface.insert(
            null,
            'user_roles',
            {
              roleId: 1,
              userId: 1,
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
              userId: 1,
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
        }
      }
    });
    await updateSequence(queryInterface, 'users');
    await updateSequence(queryInterface, 'user_roles');
    await updateSequence(queryInterface, 'module_permissions');
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkDelete(
        'module_permissions',
        { userId: 1 },
        { transaction: t },
      );

      await queryInterface.bulkDelete(
        'user_roles',
        { userId: 1 },
        { transaction: t },
      );

      await queryInterface.bulkDelete('users', { id: 1 }, { transaction: t });
    });
    await updateSequence(queryInterface, 'users');
    await updateSequence(queryInterface, 'user_roles');
    await updateSequence(queryInterface, 'module_permissions');
  },
};
