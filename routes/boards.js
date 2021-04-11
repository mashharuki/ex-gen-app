const express = require('express');
const router = express.Router();
// DBモジュールを読み込む
const db = require ('../models/index'); 
// sqliteモジュールを読み込む
const { op } = require("sequelize");
// 表示するメッセージ数用の変数
const pnum = 10;

/**
 * ログインチェック関数
 */
function check(req, res) {
    // ログイン済みかどうかをチェックする。
    if (req.session.login == null) {
        req.session.back = '/boards';
        // ログイン画面に遷移する。
        res.redirect('/users/login');
        return true;
    } else {
        return false;
    }
}

/**
 * トップページへのアクセス
 */
 router.get('/', (req, res, next) => {
     res.redirect('/boards/0');
 });

 /**
  * トップページに番号をつけてアクセス
  */
 router.get('/:page', (req, res, next) => {
    // ログイン状態を確認する。
    if (check(req, res)) { return };
    // ページ番号を取得する。
    const pg = req.params.page * 1;
    // DBからメッセージ情報を全て取り出す。
    db.Board.findAll({
        offset: pg * pnum,
        limit: pnum,
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
            model: db.User,
            required: true
        }]
    }).then(boards => { // 取り出した後の処理
        var data = {
            title: 'Boards',
            login: req.session.login,
            content: boards,
            page: pg
        }
        res.render('boards/index', data);
    });
});

/**
 * Add画面 POSTアクセス時の処理
 */
router.post('/add', (req, res, next) => {
    // ログイン状態を確認する。
    if (check(req, res)) { return };
    // SQL実行
    db.sequelize.sync().then(() => db.Board.create({
        userId: req.session.login.id,
        message: req.body.msg
    }).then( board => { // 正常にレコードが作れた場合
        res.redirect('/boards');
    }).catch((err) => { // 失敗した時の場合
        res.redirect('/boards');
    }))
});

/**
 * 利用者のホーム画面 GETアクセス時の処理
 */
 router.get('/home/:user/:id/:page', (req, res, next) => {
    // ログイン状態を確認する
    if (check(req, res)) { return };
    // idを取得する。
    const id = req.params.id * 1;
    // ページ番号を取得する。
    const pg = req.params.page * 1;
    // DBからメッセージ情報を全て取り出す。
    db.Board.findAll({
        where: { userId: id },
        offset: pg * pnum,
        limit: pnum,
        order: [
            ['createdAt', 'DESC']
        ],
        include: [{
            model: db.User,
            required: true
        }]
    }).then(boards => { // 取り出した後の処理
        var data = {
            title: 'Boards',
            login: req.session.login,
            userId: id,
            userName: req.params.user,
            content: boards,
            page: pg
        }
        res.render('boards/home', data);
    });
});

module.exports = router;