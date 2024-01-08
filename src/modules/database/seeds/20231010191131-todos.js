'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'todos',
      [
        {
          id: 1,
          content: 'A1',
          isDone: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          content: 'B2',
          isDone: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          content: 'C3',
          isDone: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 4,
          content: 'D4',
          isDone: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 5,
          content: 'E5',
          isDone: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 6,
          content: 'F6',
          isDone: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 7,
          content: 'G7',
          isDone: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('todos', null, {});
  },
};
