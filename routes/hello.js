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
            res.render('hello', data);
        });
    });        
});

module.exports = router;