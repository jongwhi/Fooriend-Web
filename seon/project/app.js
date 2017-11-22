// 기본 모듈
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// mongoose 모듈 -> db
var mongoose = require('mongoose');
// passport 모듈
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var cookieSession = require('cookie-session');
var flash = require('connect-flash');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
// mongodb 연결 -> db : fooriend
mongoose.connect('mongodb://127.0.0.1:27017/fooriend')
// view 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// express session
app.use(cookieSession({
    keys: ['fooriend'],
    cookie: {
        maxAge: 1000 * 60 * 60 // 유효기간 1시간
    }
}));
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
