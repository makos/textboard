'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    await queryInterface.addColumn(
      'Threads',
      'BoardId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Boards',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );

    return await queryInterface.addColumn(
      'Posts',
      'ThreadId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Threads',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.removeColumn(
      'Threads',
      'BoardId'
    );

    return await queryInterface.removeColumn(
      'Posts',
      'ThreadId'
    )
  }
};
