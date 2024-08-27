'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const modules = [
      {
        id: 1,
        name: 'Module 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'Module 2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        name: 'Module 3',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        name: 'Module 4',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        name: 'Module 5',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 6,
        name: 'Module 6',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 7,
        name: 'Module 7',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 8,
        name: 'Module 8',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      const moduleId = await queryInterface.rawSelect(
        'modules',
        {
          where: { id: module.id },
        },
        ['id'],
      );
      if (!moduleId) {
        queryInterface.bulkInsert('modules', [module]);
      } else {
        queryInterface.bulkUpdate('modules', module, { id: module.id });
      }
    }
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('modules', null, {});
  },
};
