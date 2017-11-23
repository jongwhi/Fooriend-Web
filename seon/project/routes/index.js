var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Store = require('../models/store');
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
router.get('/register',function(req,res){
    res.render('register');
});
router.post('/register',function(req,res){
    var newStore = new Store();
    newStore.title = req.body.title;
//    newStore = req.body.writer;
    newStore.address = req.body.address;
    newStore.opentime = req.body.opentime;
    newStore.closetime = req.body.closetime;
    newStore.reservation = req.body.reservation;
    newStore.phonenumber = req.body.phonenumber;
//    newStore.images = req.body.images;
    newStore.save(function(err){
        if(err){
            console.error(err);
            res.json({result:0});
            return;
        }
        res.redirect('/');
    });
});
router.get('/store',function(req,res){
    var storeId = req.param('id');
    Store.findOne({'_id':storeId},function(err,rawContent){
        if(err){throw err;}
        rawContent.count += 1;
        rawContent.save(function(err){
            res.render('store',{content:rawContent});
        });
    });
});
router.get('/board',function(req,res){
    Store.find({}).sort({date:-1}).exec(function(err,rawContents){
        if(err){throw err;}
        res.render('board',{content:rawContents});
    });
});
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
