'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return [
          queryInterface.addColumn('Serifs', 'text', {
              type: Sequelize.STRING,
              after: 'name'
          })
      ];
  },

  down: (queryInterface, Sequelize) => {
      return [
          queryInterface.removeColumn('Serifs', 'text')
      ];
  }
};
