'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'modules',
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
        'module_permissions',
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
          moduleId: {
            type: Sequelize.INTEGER,
            references: {
              model: {
                tableName: 'modules',
              },
              key: 'id',
            },
          },
          view: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          edit: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
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
      await queryInterface.dropTable('module_permissions', { transaction: t });
      await queryInterface.dropTable('modules', { transaction: t });
    });
  },
};
