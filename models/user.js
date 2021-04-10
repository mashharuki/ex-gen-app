'use strict';
// モデルの作成
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    pass: DataTypes.STRING,
    mail: DataTypes.STRING,
    age: DataTypes.INTEGER
  },{});
  // associateを設定する。
  User.associate = function (models) {
    
  } ; 
  return User;
};