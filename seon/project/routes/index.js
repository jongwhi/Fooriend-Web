var express = require('express');
<<<<<<< HEAD
var app = express();
var router = express.Router();
var User = require('../models/user')
var mongoose = require('mongoose');
var ejs = require('ejs');
var passport = require('passport');

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//라우팅 정보를 읽어 들여 라우팅 설정
route_loader.init(app, router);

//===== Passport 관련 라우팅 =====//

// 홈 화면 - index.ejs 템플릿을 이용해 홈 화면이 보이도록 함
router.route('/').get(function(req, res) {
    var context = {title:'로그인 및 회원가입을 하세요'};
	res.render('index',context);
});

// 로그인 화면 - login.ejs 템플릿을 이용해 로그인 화면이 보이도록 함
router.route('/login').get(function(req, res) {
	console.log('/login 패스 요청됨.');
	res.render('login.ejs', {message: req.flash('loginMessage')});
});



// 사용자 인증 - POST로 요청받으면 패스포트를 이용해 인증함
// 성공 시 /profile로 리다이렉트, 실패 시 /login으로 리다이렉트함
// 인증 실패 시 검증 콜백에서 설정한 플래시 메시지가 응답 페이지에 전달되도록 함
router.route('/login').post(passport.authenticate('local-login', {
    successRedirect : '/main', 
    failureRedirect : '/login', 
    failureFlash : true 
}));

// 회원가입 화면 - signup.ejs 템플릿을 이용해 회원가입 화면이 보이도록 함
router.route('/signup').get(function(req, res) {
	console.log('/signup 패스 요청됨.');
	res.render('signup.ejs', {message: req.flash('signupMessage')});
});

// 회원가입 - POST로 요청받으면 패스포트를 이용해 회원가입 유도함
// 인증 확인 후, 성공 시 /profile 리다이렉트, 실패 시 /signup으로 리다이렉트함
// 인증 실패 시 검증 콜백에서 설정한 플래시 메시지가 응답 페이지에 전달되도록 함
router.route('/signup').post(passport.authenticate('local-signup', {
    successRedirect : '/', 
    failureRedirect : '/signup', 
    failureFlash : true 
}));

/*
router.route('/main').get(function(req, res) {
	console.log('/login 패스 요청됨.');
    var context = '환영합니다';
	res.render('main.ejs', {id:id,message: req.flash('loginMessage')});
});
*/


// 프로필 화면 - 로그인 여부를 확인할 수 있도록 먼저 isLoggedIn 미들웨어 실행
router.route('/main').get(function(req, res) {
	console.log('/main 패스 요청됨.');
    
    // 인증된 경우, req.user 객체에 사용자 정보 있으며, 인증안된 경우 req.user는 false값임
    console.log('req.user 객체의 값');
	console.dir(req.user);
    
    // 인증 안된 경우
    if (!req.user) {
        console.log('사용자 인증 안된 상태임.');
        res.redirect('/');
        return;
    }
	
    // 인증된 경우
    console.log('사용자 인증된 상태임.');
	if (Array.isArray(req.user)) {
		res.render('main.ejs', {user: req.user[0]._doc,enroll:""});
	} else {
		res.render('main.ejs', {user: req.user,enroll:""});
	}
});

// 로그아웃 - 로그아웃 요청 시 req.logout() 호출함
router.route('/logout').get(function(req, res) {
	console.log('/logout 패스 요청됨.');
    
	req.logout();
	res.redirect('/');
});

/* 맛집등록 */
router.route('/enroll').get(function(req, res) {
	console.log('/ 패스 요청됨.');
	res.render('enroll.ejs',{ title: '', items:[] });
});

/* 맛집리뷰 */
router.route('/review').get(function(req, res) {
	console.log('/ 패스 요청됨.');
	res.render('review.ejs',{ title: '맛집리뷰', items:[] });
});


/* 맛집리뷰등록 */
router.route('/redetail').get(function(req, res) {  
	console.log('/ 패스 요청됨.');
	res.render('redetail.ejs',{ title: '', items:[] });
});


//===== Passport Strategy 설정 =====//

var LocalStrategy = require('passport-local').Strategy;

//패스포트 로그인 설정
passport.use('local-login', new LocalStrategy({
		usernameField : 'id',
		passwordField : 'password',
		passReqToCallback : true   // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, id, password, done) { 
		console.log('passport의 local-login 호출됨 : ' + id + ', ' + password);
		
		var database = app.get('database');
	    database.UserModel.findOne({ 'id' :  id }, function(err, user) {
	    	if (err) { return done(err); }

	    	// 등록된 사용자가 없는 경우
	    	if (!user) {
	    		console.log('계정이 일치하지 않음.');
	    		return done(null, false, req.flash('loginMessage', '등록된 계정이 없습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
	    	}
			// 정상인 경우
			console.log('계정과 비밀번호가 일치함.');
			return done(null, user);  // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
	    });

	}));


// 패스포트 회원가입 설정
passport.use('local-signup', new LocalStrategy({
		usernameField : 'id',
		passwordField : 'password',
		passReqToCallback : true    // 이 옵션을 설정하면 아래 콜백 함수의 첫번째 파라미터로 req 객체 전달됨
	}, function(req, id, password, done) {
        // 요청 파라미터 중 name 파라미터 확인
        var parampassword2 = req.body.password2 || req.query.password2;
        var paramNickname = req.body.nickname || req.query.nickname;
        var paramSex = req.body.sex || req.query.sex;
    
	 
		console.log('passport의 local-signup 호출됨 : ' + id + ', ' + password + ', ' + paramNickname);
		
	    // findOne 메소드가 blocking되지 않도록 하고 싶은 경우, async 방식으로 변경
	    process.nextTick(function() {
	    	var database = app.get('database');
		    database.UserModel.findOne({ 'id' :  id }, function(err, user) {
		        // 에러 발생 시
		        if (err) {
		            return done(err);
		        }
		        
		        // 기존에 사용자 정보가 있는 경우
		        if (user) {
		        	console.log('기존에 계정이 있음.');
		            return done(null, false, req.flash('signupMessage', '계정이 이미 있습니다.'));  // 검증 콜백에서 두 번째 파라미터의 값을 false로 하여 인증 실패한 것으로 처리
		        } else {
		        	// 모델 인스턴스 객체 만들어 저장
		        	var user = new database.UserModel({'id':id,'password' :password ,'password2':parampassword2, 'nickname':paramNickname,'sex':paramSex});
		        	user.save(function(err) {
		        		if (err) {
		        			throw err;
		        		}
		        		
		        	    console.log("사용자 데이터 추가함.");
		        	    return done(null, user);  // 검증 콜백에서 두 번째 파라미터의 값을 user 객체로 넣어 인증 성공한 것으로 처리
		        	});
		        }
		    });    
	    });

	}));

// 사용자 인증 성공 시 호출
// 사용자 정보를 이용해 세션을 만듦
// 로그인 이후에 들어오는 요청은 deserializeUser 메소드 안에서 이 세션을 확인할 수 있음
passport.serializeUser(function(user, done) {
	console.log('serializeUser() 호출됨.');
	console.dir(user);
	
    done(null, user);  // 이 인증 콜백에서 넘겨주는 user 객체의 정보를 이용해 세션 생성
});

// 사용자 인증 이후 사용자 요청 시마다 호출
// user -> 사용자 인증 성공 시 serializeUser 메소드를 이용해 만들었던 세션 정보가 파라미터로 넘어온 것임
passport.deserializeUser(function(user, done) {
	console.log('deserializeUser() 호출됨.');
	console.dir(user);
	
	// 사용자 정보 중 id나 email만 있는 경우 사용자 정보 조회 필요 - 여기에서는 user 객체 전체를 패스포트에서 관리
    // 두 번째 파라미터로 지정한 사용자 정보는 req.user 객체로 복원됨
    // 여기에서는 파라미터로 받은 user를 별도로 처리하지 않고 그대로 넘겨줌
	done(null, user);  
});




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
