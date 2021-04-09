const express = require('express');
const router = express.Router();
// xml2jsモジュールを取り込む。
const parseString = require('xml2js').parseString;
const http = require('http');
// sqlite3モジュールを読み込む
const sqlite3 = require('sqlite3');
// データベースオブジェクトの取得
const db = new sqlite3.Database('mydb.sqlite3');

/* 
 * GETアクセス時の処理 
 */
router.get('/', (req, res, next) => {
    // データベースのシリアライズ
    db.serialize(() => {
        // レコードの結果を詰める変数
        var rows= "";
        // レコードを全て取り出す。
        db.each("select * from mydata", (err, row) => {
            // データベースアクセス完了時の処理
            if (!err) {
                rows += "<tr><th>" + row.id + "</th><td>" + row.name + "</td><td></tr>"; 
            } 
        }, (err, count) => {
            var data = {
                title: 'Hello!',
                content: rows // データベースから取り出したデータ
            };
            // hello.ejsを呼び出す。
            res.render('hello/index', data);
        });
    });        
});

/* 
 * add画面 GETアクセス時の処理 
 */
router.get('/add', (req, res, next) => {
    var data = {
        title: 'Hello/Add',
        content: '新しいレコードを入力：'
    }
    res.render('hello/add', data);
});

/* 
 * add画面 POSTアクセス時の処理 
 */
router.post('/add', (req, res, next) => {
    const nm = req.body.name;
    const ml = req.body.mail;
    const ag = req.body.age;
    // SQLを実行する。
    db.serialize(() => {
        db.run('insert into mydata (name, mail, age) values (?, ?, ?)', nm, ml, ag);
    });
    // heeloのインデックス画面に遷移する。
    res.redirect('/hello');
});

module.exports = router;