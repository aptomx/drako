'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'modules',
      [
        {
          name: 'Module 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Module 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Module 3',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Module 4',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Module 5',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Module 6',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Module 7',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: 'Module 8',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('modules', null, {});
  },
};
