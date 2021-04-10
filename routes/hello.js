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
 * index画面 GETアクセス時の処理 
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

/**
 * show画面 GETアクセス画面
 */
router.get('/show', (req, res, next) => {
    const id = req.body.id;
    // SQL実行
    db.serialize(() => {
        const q = "SELECT * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = { 
                    title: 'Hello/show',
                    content: 'id = ' + id + 'のレコード',
                    mydata: row 
                }
                res.render('hello/show', data);
            }
        });
    });
});

/* 
 * edit画面 GETアクセス時の処理 
 */
router.get('/edit', (req, res, next) => {
    const id = req.query.id;
    db.serialize (() => {
        const q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'Hello/edit',
                    content: 'id = ' + id + '新しいレコードを編集',
                    mydata: row
                }
                res.render('hello/edit', data);
            }
        });
    });
});

/* 
 * edit画面 POSTアクセス時の処理 
 */
router.post('/edit', (req, res, next) => {
    const id = req.body.id;
    const nm = req.body.name;
    const ml = req.body.mail;
    const ag = req.body.age;
    // SQLを構築する。
    const q = "update mydata set name = ?, mail = ?, age = ? where id = ?";
    // SQLを実行する。
    db.serialize(() => {
        db.run(q, nm, ml, ag, id);
    });
    // heeloのインデックス画面に遷移する。
    res.redirect('/hello');
});

/* 
 * delete画面 GETアクセス時の処理 
 */
router.get('/delete', (req, res, next) => {
    const id = req.query.id;
    db.serialize (() => {
        const q = "select * from mydata where id = ?";
        db.get(q, [id], (err, row) => {
            if (!err) {
                var data = {
                    title: 'Hello/delete',
                    content: 'id = ' + id + 'のレコードを削除',
                    mydata: row
                }
                res.render('hello/delte', data);
            }
        });
    });
});

/* 
 * delete画面 POSTアクセス時の処理 
 */
router.post('/delete', (req, res, next) => {
    const id = req.body.id;
    // SQLを実行する。
    db.serialize(() => {
        // SQLを構築する。
        const q = "delete from mydata where id = ?";
        db.run(q, id);
    });
    // heeloのインデックス画面に遷移する。
    res.redirect('/hello');
});

/* 
 * find画面 GETアクセス時の処理 
 */
router.get('/find', (req, res, next) => {
    db.serialize (() => {
        db.all("select * from mydata", (err, rows) => {
            if (!err) {
                var data = {
                    title: 'Hello/find',
                    find: '',
                    content: '検索条件を入力してください。',
                    mydata: rows
                }
                res.render('hello/find', data);
            }
        });
    });
});

/* 
 * find画面 POSTアクセス時の処理 
 */
router.post('/find', (req, res, next) => {
    const find = req.body.find;
    // SQLを実行する。
    db.serialize(() => {
        // SQLを構築する。
        const q = "select * from mydata where ";
        db.all(q + find , [], (err, rows) => {
            if (! err) {
                var data = {
                    title: 'Hello/find',
                    find: find,
                    content: '検索条件' + find,
                    mydata: rows
                }
                // heeloのインデックス画面に遷移する。
                res.redirect('hello/find', data);
            }
        });
    });
});

module.exports = router;