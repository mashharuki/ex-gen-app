'use strict';
// Userモデルの作成
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "名前は必ず入力してください。"
        }
      }
    },
    pass: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "パスワードは必ず入力してください。"
        }
      }
    },
    mail: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: "メールアドレスを入力してください。"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: {
          msg: "整数を入力してください。"
        },
        min: {
          args:  [0],
          msg: "ゼロ以上の値が必要です。"
        }
      }
    }
  },{});
  // associateを設定する。
  User.associate = function (models) {
    User.hasMany(models.Board);
  } ; 
  return User;
};