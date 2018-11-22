'use strict';
module.exports = (sequelize, DataTypes) => {
  const Thread = sequelize.define('Thread', {
  }, {});
  Thread.associate = function (models) {
    Thread.belongsTo(models.Board);
    Thread.hasMany(models.Post);
    // associations can be defined here
  };
  return Thread;
};
