'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    body: DataTypes.TEXT
  }, {});
  Post.associate = function (models) {
    Post.belongsTo(models.Thread);
    // associations can be defined here
  };
  return Post;
};
