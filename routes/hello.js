const express = require('express');
const router = express.Router();
// xml2jsモジュールを取り込む。
const parseString = require('xml2js').parseString;
const http = require('http');

/* 
 * GETアクセス時の処理 
 */
router.get('/', (req, res, next) => {
    // インターネット上の情報を取得する変数
    var opt = {
        host: 'news.google.com',
        port: 443,
        path: '/rss?hl=ja&ie=UTF-8&oe=UTF-8&gl=JP&ceid=JP:ja'
    };
    // RSSから必要な情報を取り出す。
    http.get(opt, (res2) => {
        var body = '';
        res2.on('data', (data) => {
            body += data;
        });
        // データを受信し終わった時の処理
        res2.on('end', () => {
            parseString(body.trim(), (err, result) => {
                // 取得結果を表示する。
                console.log(result);
                var data = {
                    title: 'Google News',
                    content: result.rss.channel[0].item
                };
                // hello.ejsを呼び出す。
                res.render('hello', data);
            });
        })
    });
});

module.exports = router;