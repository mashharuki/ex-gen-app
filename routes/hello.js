const express = require('express');
const router = express.Router();

/* 
 * GETアクセス時の処理 
 */
router.get('/', (req, res, next) => {
    // メッセージ用の変数を用意する。
    var msg = '※何か書いて送信してください。';

    if (req.session.message != undefined) {
        msg = "Last Message：" + req.session.message;
    }

    var data = {
        title: 'Hello!',
        content: msg
    };
    // hello.ejsを呼び出す。
    res.render('hello', data);
});

/* 
 * POSTアクセス時の処理 
 */
router.post('/post', (req, res, next) => {
    // message要素から値を取り出す。
    var msg = req.body['message'];
    // セッションから値を取得する。
    req.session.message = msg;
    var data = {
        title: 'Hello!',
        content: "Last Message：" + req.session.message 
    };
    // hello.ejsを呼び出す。(dataをセットする。)
    res.render('hello', data);
});

module.exports = router;