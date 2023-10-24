'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert(
      'todos',
      [
        {
          content: 'A1',
          isDone: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: 'B2',
          isDone: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: 'C3',
          isDone: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: 'D4',
          isDone: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: 'E5',
          isDone: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          content: 'F6',
          isDone: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
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
