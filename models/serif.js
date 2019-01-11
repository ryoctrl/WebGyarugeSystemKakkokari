'use strict';
module.exports = (sequelize, DataTypes) => {
  const Serif = sequelize.define('Serif', {
    name: DataTypes.STRING,
    text: DataTypes.STRING,
    path: DataTypes.STRING,
    speaker_id: DataTypes.INTEGER,
    picture_id: DataTypes.INTEGER
  }, {
    underscored: true,
  });
  Serif.associate = function(models) {
      Serif.belongsTo(models.Speaker);
  };
  return Serif;
};
