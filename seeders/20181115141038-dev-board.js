'use strict';
const models = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Boards', [{
      id: 1,
      name: 'dev',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    const board = await models.Board.findOne({
      where: {
        name: 'dev'
      }
    });

    await queryInterface.bulkInsert('Threads', [
      { id: 1, threadId: 1, createdAt: new Date(), updatedAt: new Date(), BoardId: board.id },
      { id: 2, threadId: 2, createdAt: new Date(), updatedAt: new Date(), BoardId: board.id }], {});

    const threads = await models.Thread.findAll({});

    return await queryInterface.bulkInsert('Posts', [
      { id: 1, title: "Testaroo", body: "Blah blah blah", createdAt: new Date(), updatedAt: new Date(), ThreadId: threads[0].id },
      { id: 2, title: "Test 2: Electric Boogaloo", createdAt: new Date(), updatedAt: new Date(), body: "This is just testing stuff", ThreadId: threads[1].id },
      { id: 3, title: "", body: "This is a reply", createdAt: new Date(), updatedAt: new Date(), ThreadId: threads[0].id }
    ], {});
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Posts', null, {});
    await queryInterface.bulkDelete('Threads', null, {});
    await queryInterface.bulkDelete('Boards', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
