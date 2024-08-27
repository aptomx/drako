'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const roles = [
      {
        id: 1,
        name: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Client',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i];
      const roleId = await queryInterface.rawSelect(
        'roles',
        {
          where: { id: role.id },
        },
        ['id'],
      );
      if (!roleId) {
        queryInterface.bulkInsert('roles', [role]);
      } else {
        queryInterface.bulkUpdate('roles', role, { id: role.id });
      }
    }
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('roles', null, {});
  },
};
