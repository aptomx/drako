'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'roles',
        {
          id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true,
          },
          name: {
            type: Sequelize.STRING,
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        },
        { transaction: t },
      );

      await queryInterface.createTable(
        'user_roles',
        {
          id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true,
          },
          userId: {
            type: Sequelize.INTEGER,
            references: {
              model: {
                tableName: 'users',
              },
              key: 'id',
            },
          },
          roleId: {
            type: Sequelize.INTEGER,
            references: {
              model: {
                tableName: 'roles',
              },
              key: 'id',
            },
          },
          createdAt: Sequelize.DATE,
          updatedAt: Sequelize.DATE,
        },
        { transaction: t },
      );
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('user_roles', { transaction: t });
      await queryInterface.dropTable('roles', { transaction: t });
    });
  },
};
