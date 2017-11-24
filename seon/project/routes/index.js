var express = require('express');
<<<<<<< HEAD
<<<<<<< HEAD
var app = express();
=======
>>>>>>> parent of fffd8d5... 1
var router = express.Router();
var User = require('../models/user')
var mongoose = require('mongoose');
var ejs = require('ejs');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title : 'Fooriend' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'Fooriend' });
});


router.post('/gologin', function(req, res, next) {
   User.findOne({username: req.body.username, password: req.body.password}, function(err, users){
       if(err){
           console.error(err);
           res.json({result:0});
           return;
       }
       res.json(users);
   });
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

<<<<<<< HEAD



//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 시작된 서버 객체를 리턴받도록 합니다. 
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

	// 데이터베이스 초기화
	database.init(app, config);
   
});
=======
var passport = require('passport');
var User = require('../models/user');
var Store = require('../models/store');
var router = express.Router();
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
    res.render('register');
});
// 맛집 등록 버튼 클릭 시
router.post('/register',function(req,res){
    // storeSquema에 입력받은 값 저장 -> stores db에 data 저장
    var newStore = new Store();
    newStore.title = req.body.title;
    newStore.kind = req.body.kind;
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
        res.redirect('/'); // 저장 성공시 main page로 -> index.ejs
    });
});
// 맛집 클릭 시 -> store.ejs
router.get('/store',function(req,res){
    var storeId = req.param('id');
    // 넘겨받은 id값을 변수에 저장 후 db에서 해당 id를 가진 정보 찾아서 rawContent 변수에 저장
    Store.findOne({'_id':storeId},function(err,rawContent){ 
        if(err){throw err;}
        rawContent.count += 1; // 조회수 +1
        rawContent.save(function(err){
            res.render('store',{content:rawContent});
        });
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
// 랭킹 메뉴 -> lanking.ejs
router.get('/lanking', function(req,res){
    Store.find({}).sort({count:-1}).exec(function(err,rawContents){
        if(err){throw err;}
        res.render('lanking',{content:rawContents});
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
>>>>>>> 4a59b3539593adebc4f2163440518c7748177c31
=======
module.exports = router;
>>>>>>> parent of fffd8d5... 1
