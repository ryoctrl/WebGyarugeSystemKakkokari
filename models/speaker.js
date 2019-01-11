'use strict';
module.exports = (sequelize, DataTypes) => {
  const Speaker = sequelize.define('Speaker', {
    name: DataTypes.STRING
  }, {
    underscored: true,
  });
  Speaker.associate = function(models) {
    // associations can be defined here
  };
  return Speaker;
};