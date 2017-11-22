var express = require('express');
var router = express.Router();
var User = require('../models/user')
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title : 'Fooriend' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Fooriend' });
});

router.post('/gologin', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), function(req, res, next) {
   res.redirect('/login');
});

/* GET signup page. */
router.get('/regi', function(req, res, next) {
  res.render('regi', { title: 'Fooriend' });
});
router.get('/board', function(req, res, next) {
  res.render('board', { title: 'Fooriend' });
});
router.get('/store', function(req, res, next) {
  res.render('store', { title: 'Fooriend' });
});
router.get('/lank', function(req, res, next) {
  res.render('lank', { title: 'Fooriend' });
});
router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Fooriend' });
});
router.get('/review', function(req, res, next) {
  res.render('review', { title: 'Fooriend' });
});
router.get('/logout', function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.post('/insert', function(req,res,next){
var newUser = new User();
newUser.username = req.body.username;
newUser.password = req.body.password;
newUser.nickname = req.body.nickname;
newUser.gender = req.body.gender;
    
newUser.save(function(err){
if(err){
console.error(err);
res.json({result: 0});
return;
}
res.redirect('/');
});
});

passport.use(new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: true,
    passReqToCallback: true
}, function(req, username, password, done){
    User.findOne({'username': username}, function(err, user){
        if(err){return done(err);}
        
        if(!user){
            return done(null, false, req.flash('loginMessage', 'No User'));
        } 
        return done(null, user);
    });
}));

passport.serializeUser(function(user, done){
    done(null, user);
});

passport.deserializeUser(function(user, done){
    done(null, user);
});

var isAuthenticated = function(req, res, next){
    if(req.isAuthenticated())
        return next();
    res.redirect('/login');
};

module.exports = router;
