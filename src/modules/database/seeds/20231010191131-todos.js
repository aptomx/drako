'use strict';

/** @type {import('sequelize-cli').Migration} */
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
        'todos',
        {
          where: { id: todo.id },
        },
        ['id'],
      );
      if (!todoId) {
        queryInterface.bulkInsert('todos', [todo]);
      } else {
        queryInterface.bulkUpdate('todos', todo, { id: todo.id });
      }
    }
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('todos', null, {});
  },
};
