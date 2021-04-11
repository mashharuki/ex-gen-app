const express = require('express');
const router = express.Router();
// DBモジュールを読み込む
const db = require ('../models/index'); 
// sqliteモジュールを読み込む
const { op } = require("sequelize");
// Markdown系のモジュールを読み込む
const MarkdownIt = require('markdown-it');
// インスタンス化する。
const markdown = new MarkdownIt();
// ページに表示する投稿する記事
const pnum = 10;

/**
 * ログインチェック関数
 */
 function check(req, res) {
    // ログイン済みかどうかをチェックする。
    if (req.session.login == null) {
        req.session.back = '/md';
        // ログイン画面に遷移する。
        res.redirect('/users/login');
        return true;
    } else {
        return false;
    }
 };

 /**
  * トップページにアクセス
  */
  router.get('/', (req, res, next) => {
    // ログイン状態を確認する。
    if (check(req, res)) { return };
    // DBからメッセージ情報を全て取り出す。
    db.Board.findAll({
        where: { userId: req.session.login.id },
        limit: pnum,
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(mds => { // 取り出した後の処理
        var data = {
            title: 'Markdown Search',
            login: req.session.login,
            message: "※最近の投稿データ",
            form: { find: '' },
            content: mds
        };
        res.render('md/index', data);
    });
});

/**
  *  検索フォームでのPOSTアクセス時の処理
  */
 router.get('/', (req, res, next) => {
    // ログイン状態を確認する。
    if (check(req, res)) { return };
    // DBからメッセージ情報を全て取り出す。
    db.Board.findAll({
        where: { 
            userId: req.session.login.id,
            content: {[Op.like]: '%' + req.body.find + '%' }   
        },
        order: [
            ['createdAt', 'DESC']
        ]
    }).then(mds => { // 取り出した後の処理
        var data = {
            title: 'Markdown Search',
            login: req.session.login,
            message: '※"' + req.body.find + '"で検索された最近の投稿データ',
            form: req.body,
            content: mds
        };
        res.render('md/index', data);
    });
});

/**
 * 新規作成画面でのGETアクセス時の処理
 */
router.get('/add', (req, res, next) => {
    // ログイン状態を確認する。
    if (check(req, res)) { return };
    // レンダリング
    res.render('md/add', {
        title: 'Markdown/Add'
    });
});

/**
 * 新規作成画面でのPOSTアクセス時の処理
 */
 router.post('/add', (req, res, next) => {
    // ログイン状態を確認する。
    if (check(req, res)) { return };
    // SQLを実行する。
    db.sequelize.sync().then( () => db.Markdata.create({
        userId: req.session.login.id,
        title: req.body.title,
        content: req.body.content,
    }).then(model => {
        // トップページにリダイレクトする。
        res.redirect('/md');
    }));
 });

 /**
  * /markにアクセスした際のリダイレクト
  */
 router.get('/mark/', (req, res, next) => {
    // トップページにリダイレクトする。
    res.redirect('/md');
    return;
 });

/**
 * 指定IDのMarkdata要素
 */
router.get('/mark/:id', (req, res, next) => {
    // ログイン状態を確認する。
    if (check(req, res)) { return };
    db.Markdata.findOne({
        where: {
            id: req.params.id,
            userId: req.session.login.id
        },
    }).then((model) => {
        // Markdata作成関数の呼び出し
        makepage(req, res, model, true);
    });
});

/**
 * Markdataの更新処理
 */
router.post('/mark/:id', (req, res, next) => {
    // ログイン状態を確認する。
    if (check(req, res)) { return };
    db.Markdata.findByPk(req.params.id).then( md => {
        md.content = req.body.source;
        md.save().then( (model) => {
            // Markdata作成関数の呼び出し
            markpage(req, res, model, false);
        });
    })
});

/**
 * 指定IDのMarkDataの表示ページを作成する関数
 */
function markpage(req, res, model, flag) {
    var footer;
    // フラグの状態を確認する。　
    if (flag) {
        // 日付を取得する。(作成日と更新日)
        var d1 = new Date(model.createdAt);
        var dstr1 = d1.getFullYear() + '-' + (d1.getMonth() + 1) + '-' + d1.getDate() + ' ' + d1.getHours() + ':' + d1.getMinutes() + ':' + d1.getSeconds();
        var d2 = new Date(model.updatedAt);
        var dstr2 = d2.getFullYear() + '-' + (d2.getMonth() + 1) + '-' + d2.getDate() + ' ' + d2.getHours() + ':' + d2.getMinutes() + ':' + d2.getSeconds();
        // 変数にセットする。
        footer = '(created: ' + dstr1 + ', updated: ' + dstr2 + ')';
    } else {
        footer = '(Updating data and time information....)';
    }

    var data = {
        title: 'Markdown',
        id: req.params.id,
        head: model.title,
        footer: footer,
        content: markdown.render(model.content),
        source: model.content
    };
    // レンダリングする。
    res.render('md/mark', data);
}