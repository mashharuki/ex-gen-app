const express = require('express');
const router = express.Router();

/* 
 * GETアクセス時の処理 
 */
router.get('/', (req, res, next) => {
    var data = {
        title: 'Hello!',
        content: '何か書いて送信してください。'
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
    var data = {
        title: 'Hello!',
        content: 'あなたは、「' + msg + '」と送信しました。'
    };
    // hello.ejsを呼び出す。(dataをセットする。)
    res.render('hello', data);
});

module.exports = router;