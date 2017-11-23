// 기본 모듈
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// mongoose 모듈
var mongoose = require('mongoose');
// passport, session 모듈
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
// 라우트 분할
var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
// database 연결 - db name:fooriend
mongoose.connect('mongodb://127.0.0.1:27017/fooriend');
// view 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// session 정의
app.use(session({
    secret:'fooriend',
    resave: true,
    saveUninitialized: true
}));
// secret : 각 session이 client에서 암호화되도록함 - 쿠키해킹방지
// resave : 미들웨어 옵션, true하면 session이 수정되지 않은 경우에도 session update
// saveUninitialized : 미들웨어 옵션, 초기화되지 않은 session 재설정
// passport 설정
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

module.exports = app;
