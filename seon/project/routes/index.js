var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user');
var Store = require('../models/store');
var Review = require('../models/review');
var localStrategy = require('passport-local').Strategy;

// main page
router.get('/', function(req, res, next) {
    // user 정보가 없을 때 로그인 page로 이동
    if(!req.user){
        res.redirect('/login');
        return;
    }
    // user 정보가 있으면 main page로 -> index.ejs
    if(Array.isArray(req.user)){
        Store.find({}).sort({count:-1}).exec(function(err,rawContents){
        if(err){throw err;}
        res.render('index', {user: req.user[0]._doc, content:rawContents});
        });
    } else{
        Store.find({}).sort({count:-1}).exec(function(err,rawContents){
        if(err){throw err;}
        res.render('index', {user: req.user, content:rawContents});
        });
    }
});
// app에서 login 하기 위해서 users table의 데이터 불러오기
router.get('/get-user', function(req,res,next){
    User.find(function(err, users){
        if(err) {
            return res.status(500).send({error: 'database failure'});
        }
        res.send(users);
    });
});
// app에서 stores table에서 맛집 정보 데이터 불러오기
router.get('/get-store', function(req,res,next){
    Store.find(function(err, stores){
        if(err) {
            return res.status(500).send({error: 'database failure'});
        }
        res.send(stores);
    });
});
// login page -> login.ejs
router.get('/login',function(req,res){
    res.render('login',{message: req.flash('loginmessage')});
});
// login page에서 login 버튼 클릭시 -> passport.authenticate('login') 함수 호출
router.post('/login',passport.authenticate('login',{
    successRedirect:'/', // login 성공 시 main page로 -> index.ejs
    failureRedirect:'/login', // login 실패 시 login page로 -> login.ejs
    failureFlash: true
}));
// signup page - 회원가입 page -> signup.ejs
router.get('/signup',function(req,res){
    res.render('signup', {message: req.flash('signupmessage')});
});
// signup page에서 signup 버튼 클릭시 -> passport.authenticate('signup') 함수 호출
router.post('/signup',passport.authenticate('signup',{
    successRedirect : '/login', // signup 성공 시 login page로 -> login.ejs
    failureRedirect : '/signup', // signup 실패 시 signup page로 -> signup.ejs
    failureFlash : true
}));
// logout 버튼 클릭시
router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
});
// 맛집 등록 -> register.ejs
router.get('/register',function(req,res){
    var userId = req.param('id');
    User.findOne({'_id':userId},function(err,newUser){ 
        if(err){throw err;}
        newUser.save(function(err){
            res.render('register',{user:newUser});
        });
    });
});
// 맛집 등록 버튼 클릭 시
router.post('/register',function(req,res){
    // storeSquema에 입력받은 값 저장 -> stores db에 data 저장
    var newStore = new Store();
    newStore.title = req.body.title;
    newStore.kind = req.body.kind;
    newStore.writer = req.user.nickname;
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
        res.redirect('/'); // 저장 성공시 main page로 -> index.ejs
    });
});
// 맛집 클릭 시 -> store.ejs
router.get('/store',function(req,res){
    var storeTitle = req.param('id1');
    // 넘겨받은 id값을 변수에 저장 후 db에서 해당 id를 가진 정보 찾아서 rawContent 변수에 저장
    Review.find({'storetitle':storeTitle}).sort({date:-1}).exec(function(err,rawReview){
        if(err){throw err;}
        else {
            Store.findOne({'title':storeTitle},function(err,rawContent){ 
                if(err){throw err;}
                rawContent.count += 1; // 조회수 +1
                rawContent.save(function(err){
                res.render('store',{content:rawContent, user:req.param('id2'), review:rawReview});
                });
            });
        }
    });
});
// 게시판 메뉴 -> board.ejs
router.get('/board',function(req,res){
    // 최근 날짜 순으로 rawContents 변수에 저장
    Store.find({}).sort({date:-1}).exec(function(err,rawContents){
        if(err){throw err;}
        res.render('board',{content:rawContents});
    });
});
// review 쓰는 폼
router.get('/review', function(req,res){
    var storeId = req.param('data1');
    var userId = req.param('data2');
    User.findOne({'_id':userId},function(err,newUser){
        if(err){throw err;}
        newUser.save(function(err){
            res.render('review',{user:newUser, store:storeId});
        });
    });
});
router.post('/review',function(req,res){
    var newReview = new Review();
    newReview.reviewtitle = req.body.reviewtitle;
    newReview.storeid = req.store;
    newReview.writer = req.user.nickname;
    newReview.content = req.body.content;
    newReview.save(function(err){
        if(err){
            console.error(err);
            res.json({result:0});
            return;
        }
        res.json(newReview);
    });
});
// information 페이지 -> 회원 정보
router.get('/information', function(req,res){
    var userId = req.param('id');
    User.findOne({'_id':userId},function(err,newUser){ 
        if(err){throw err;}
        newUser.save(function(err){
            res.render('information',{user:newUser});
        });
    });
});
// update 페이지 -> 회원 정보 수정
router.get('/update',function(req,res){
    var userId = req.param('id');
    User.findOne({'_id':userId},function(err,newUser){ 
        if(err){throw err;}
        newUser.save(function(err){
            res.render('update',{user:newUser});
        });
    });
});
router.post('/update',function(req,res){
    User.update({'_id':req.user._id},{$set:req.body},function(err,output){
        if(err) res.status(500).json({ error: 'database failure' });
        console.log(output);
        if(!output.n) return res.status(404).json({ error: 'user not found' });
        //res.json( { message: ‘book updated’ } );
        res.redirect('/');
    });
});
// login 함수
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
// signup 함수
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
module.exports = router;
