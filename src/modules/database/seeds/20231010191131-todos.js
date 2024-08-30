'use strict';
/** @type {import('sequelize-cli').Migration} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const updateSequence = require('../scripts/update-sequence');
const table = 'todos';

module.exports = {
  async up(queryInterface) {
    const todos = [
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
    ];
    for (let i = 0; i < todos.length; i++) {
      const todo = todos[i];
      const todoId = await queryInterface.rawSelect(
        table,
        {
          where: { id: todo.id },
        },
        ['id'],
      );
      if (!todoId) {
        await queryInterface.bulkInsert(table, [todo]);
      } else {
        await queryInterface.bulkUpdate(table, todo, { id: todo.id });
      }
    }
    await updateSequence(queryInterface, table);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(table, null, {});
    await updateSequence(queryInterface, table);
  },
};
