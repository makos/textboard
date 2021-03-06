'use strict';
module.exports = (sequelize, DataTypes) => {
  const Board = sequelize.define('Board', {
    name: DataTypes.STRING
  }, {});
  Board.associate = function (models) {
    Board.hasMany(models.Thread);
    // associations can be defined here
  };
  return Board;
};
