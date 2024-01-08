'use strict';
const authLogStatus = ['SUCCESS', 'FAILED'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('auth_logs', {
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      ip: {
        type: Sequelize.STRING,
      },
      userAgent: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM(...authLogStatus),
      },
      error: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timestamp: Sequelize.DATE,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    return queryInterface.dropTable('auth_logs');
  },
};
