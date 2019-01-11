'use strict';
module.exports = (sequelize, DataTypes) => {
  const Picture = sequelize.define('Picture', {
    name: DataTypes.STRING,
    path: DataTypes.STRING
  }, {
    underscored: true,
  });
  Picture.associate = function(models) {
    // associations can be defined here
  };
  return Picture;
};