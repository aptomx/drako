'use strict';

/** @type {import('sequelize-cli').Migration} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const updateSequence = require('../scripts/update-sequence');
const table = 'roles';

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
        table,
        {
          where: { id: role.id },
        },
        ['id'],
      );
      if (!roleId) {
        await queryInterface.bulkInsert(table, [role]);
      } else {
        await queryInterface.bulkUpdate(table, role, { id: role.id });
      }
    }
    await updateSequence(queryInterface, table);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(table, null, {});
    await updateSequence(queryInterface, table);
  },
};
