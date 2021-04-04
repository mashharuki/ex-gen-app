const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
    var data = {
        title: 'Hello!',
        content: 'これは、サンプルのコンテンツです。<br>this is sample content.'
    };
    // hello.ejsを呼び出す。
    res.render('hello', data);
});

module.exports = router;