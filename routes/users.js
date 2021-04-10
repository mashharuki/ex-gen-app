const express = require('express');
const router = express.Router();
// DBモジュールを読み込む
const db = require ('../models/index'); 

/**
 *  index画面 GETアクセス時の画面
 */
router.get('/', (req, res, next) => {
  // 全てのレコードを取り出す。
  db.User.findAll().then(users => {
    var data = {
      title: 'Users/Index',
      content: users
    }
    res.render('users/index', data);
  });
});

module.exports = router;
