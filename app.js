/**
 * Webアプリケーション本体の設定するファイル
 */
var createError = require('http-errors');
// expressモジュールを読み込む
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// sessionモジュールを読み込む
const session = require('express-session');
// 「/」でアクセスしたときにindex.jsが実行されるように設定する。
var indexRouter = require('./routes/index');
// 「/users」でアクセスしたときにusers.jsが実行されるように設定する。
var usersRouter = require('./routes/users');
// 「/hello」でアクセスしたときにhello.jsが実行されるように設定する。
var helloRouter = require('./routes/hello');
// 「/boards」でアクセスしたときにboards.jsが実行されるように設定する。
var boardsRouter = require('./routes/boards');
// アプリケーションの作成
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// セッション用変数を用意する。
var session_opt = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60 * 60 * 1000 }
};
// 関数読み込み
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(session_opt));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/hello', helloRouter);
app.use('/boards', boardsRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// module.exportsにappオブジェクトを設定する。
module.exports = app;
