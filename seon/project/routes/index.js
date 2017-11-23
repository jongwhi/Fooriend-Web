var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();
var localStrategy = require('passport-local').Strategy;

/* GET home page. */
router.get('/', function(req, res, next) {
    if(!req.user){
        res.redirect('/login');
        return;
    }
    if(Array.isArray(req.user)){
        res.render('index', {user: req.user[0]._doc, enroll:""});
    } else{
        res.render('index', {user: req.user,enroll:""});
    }
});
router.get('/login',function(req,res){
    res.render('login',{message: req.flash('loginmessage')});
});
router.post('/login',passport.authenticate('login',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash: true
}));
router.get('/signup',function(req,res){
    res.render('signup', {message: req.flash('signupmessage')});
});
router.post('/signup',passport.authenticate('signup',{
    successRedirect : '/login', 
    failureRedirect : '/signup', 
    failureFlash : true 
}));
router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});
router.get('/store',function(req,res){
    res.render('store');
});
router.post('/store',passport.authenticate('store',{
    successRedirect: '/',
    failureRedirect: '/store',
    failureFlash: true
}));
passport.use('login', new localStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true }, function(req, username, password, done){
    User.findOne({'username':username}, function(err,user){
        if(err) {return done(err);}
        if(!user){
            return done(null, false, req.flash('loginmessage', 'No User'));
        }
        return done(null, user);
    });
}));
passport.use('signup', new localStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true }, function(req, username, password, done){
    var paramrepassword = req.body.repassword || req.query.repassword;
    var paramnickname = req.body.nickname || req.query.nickname;
    var paramgender = req.body.gender || req.query.gender;
    
    process.nextTick(function(){
        User.findOne({'username':username}, function(err, user){
            if(err) {return done(err);}
            if(user){
                return done(null, false, req.flash('signupmessage', 'Already Using Username'));
            } else{
                var newUser = new User({'username':username, 'password':password, 'repassword':paramrepassword, 'nickname':paramnickname, 'gender':paramgender});
                newUser.save(function(err){
                    if(err) {throw err;}
                    return done(null,user);
                });
            }
        });
    });
}));
passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(user, done){
    done(null, user);
});
module.exports = router;
