'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'roles',
      [
        {
          name: 'Admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Client',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('roles', null, {});
  },
};
