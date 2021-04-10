const express = require('express');
const { Forbidden } = require('http-errors');
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

/* 
 * add画面 GETアクセス時の処理 
 */
router.get('/add', (req, res, next) => {
  var data = {
      title: 'Users/Add',
      form: new db.User(),
      err: null
  }
  res.render('users/add', data);
});

/* 
* add画面 POSTアクセス時の処理 
*/
router.post('/add', (req, res, next) => {
    // SQLを実行する。
    db.sequelize.sync().then( () => db.User.create({
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      age: req.body.age
    })).then(users => { // 正常時の処理
      // usersのインデックス画面に遷移する。
      res.redirect('/users');
    }).catch(err => { // エラーが発生した場合
      var data = {
        title: 'Users/Add',
        form: form,
        err: err
      }
      // レンダリングする。
      res.render('users/add', data);
    });
});

/* 
 * edit画面 GETアクセス時の処理 
 */
router.get('/edit', (req, res, next) => {
  db.User.findByPk(req.query.id).then(user => {
    var data = {
      title: 'Users/Edit',
      form: user
    }
    res.render('users/edit', data);
  });
});

/* 
* edit画面 POSTアクセス時の処理 
*/
router.post('/edit', (req, res, next) => {
    // SQLを実行する。
    db.sequelize.sync().then( () => db.User.update({
      name: req.body.name,
      pass: req.body.pass,
      mail: req.body.mail,
      age: req.body.age
    },{
      where: { id: req.body.id }
    })).then(users => {
      // usersのインデックス画面に遷移する。
      res.redirect('/users');
    });
});

/* 
 * delete画面 GETアクセス時の処理 
 */
router.get('/delete', (req, res, next) => {
  db.User.findByPk(req.query.id).then(user => {
    var data = {
      title: 'Users/Delete',
      form: user
    }
    res.render('users/delete', data);
  });
});

/* 
* delete画面 POSTアクセス時の処理 
*/
router.post('/delete', (req, res, next) => {
    // SQLを実行する。
    db.sequelize.sync().then( () => db.User.destroy({
      where: { id: req.body.id }
    })).then(users => {
      // usersのインデックス画面に遷移する。
      res.redirect('/users');
    });
});

module.exports = router;
