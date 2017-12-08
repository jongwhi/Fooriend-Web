var express = require('express');
var app = express();
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = require('../models/user');
var Store = require('../models/store');
var Review = require('../models/review');
var localStrategy = require('passport-local').Strategy;
var fs = require('fs');
// multer 모듈 -> 파일 업로드에 필요한 모듈
var multer = require('multer');
var filename='';
// 파일 업로드 설정하기
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, 'public/images/')
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname)
    }
});
var upload = multer({ 
    storage: storage
});
// main page -> index.ejs로 이동
router.get('/', function(req, res, next) {
    // 유저 정보가 없으면 user에 no라는 데이터 입력 -> main page에서 메뉴에 login & signup 표시
    if(!req.user){
<<<<<<< HEAD
=======
        res.redirect('/login');
        return;
    }
    // user 정보가 있으면 main page로 -> index.ejs
    if(Array.isArray(req.user)){
        // stores table에서 조회수 순으로 rawContents에 저장
>>>>>>> 817880fcc3dd3571c26dcb6f09487261d2cbd0f5
        Store.find({}).sort({count:-1}).exec(function(err,rawContents){
            if(err){throw err;}
            res.render('index', {user: "no", store:rawContents});
        });
    // 유저 정보가 있으면 user에 유저 정보 입력 -> main page에서 메뉴에 logout & information 표시
    } else{
        Store.find({}).sort({count:-1}).exec(function(err,rawContents){
            if(err){throw err;}
            res.render('index', {user: req.user, store:rawContents});
        });
    }
});
// app에서 users table의 데이터 불러오기
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
// app에서 reviews table에서 리뷰 정보 데이터 불러오기
router.get('/get-review', function(req,res,next){
    Review.find(function(err, stores){
        if(err) {
            return res.status(500).send({error: 'database failure'});
        }
        res.send(reviews);
    });
});
// login page -> login.ejs로 이동
router.get('/login',function(req,res){
    res.render('login',{message: req.flash('loginmessage')});
});
// login page에서 login 버튼 클릭시 -> passport.authenticate('login') 함수 호출
router.post('/login',passport.authenticate('login',{
    successRedirect:'/', // login 성공 시 main page로 -> index.ejs
    failureRedirect:'/login', // login 실패 시 login page로 -> login.ejs
    failureFlash: true
}));
// signup page -> signup.ejs로 이동
router.get('/signup',function(req,res){
    res.render('signup', {message: req.flash('signupmessage')});
});
// signup page에서 signup 버튼 클릭시 -> passport.authenticate('signup') 함수 호출
router.post('/signup',passport.authenticate('signup',{
    successRedirect:'/login', // signup 성공 시 login page로 -> login.ejs
    failureRedirect:'/signup', // signup 실패 시 signup page로 -> signup.ejs
    failureFlash: true
}));
// logout 버튼 클릭시
router.get('/logout',function(req,res){
    req.logout();
    res.redirect('/');
    // logout 성공 시 main page로 -> index.ejs
});
<<<<<<< HEAD
// information 페이지 -> information.ejs로 이동 - 회원 정보 보기
router.get('/information', function(req,res){
    var userId = req.param('id');
    User.findOne({'_id':userId},function(err,newUser){ 
        if(err){throw err;}
        newUser.save(function(err){
            res.render('information',{user:newUser});
        });
    });
});
// update 페이지 -> 회원 정보 수정 -> update.ejs로 이동
router.get('/update',function(req,res){
=======
// 맛집 등록 -> register.ejs
router.get('/register',function(req,res){
    // 파라미터로 넘겨받은 값 변수에 저장
>>>>>>> 817880fcc3dd3571c26dcb6f09487261d2cbd0f5
    var userId = req.param('id');
    // 파라미터로 받은 값을 users table에서 비교 후 newUser 변수에 저장
    User.findOne({'_id':userId},function(err,newUser){ 
        if(err){throw err;}
        newUser.save(function(err){
<<<<<<< HEAD
            res.render('update',{user:newUser});
=======
            // user라는 변수에 newUser 저장 후 register.ejs로 전달
            res.render('register',{user:newUser});
>>>>>>> 817880fcc3dd3571c26dcb6f09487261d2cbd0f5
        });
    });
});
// update page에서 update 버튼 클릭시 -> passport.authenticate('update') 함수 호출
router.post('/update',passport.authenticate('update',{
    successRedirect:'/', // update 성공 시 main page로 -> index.ejs
    failureRedirect:'/update', // update 실패 시 update page로 -> update.ejs
    failureFlash: true
}));
// 맛집 등록 -> register.ejs로 이동
router.get('/register',function(req,res){
    // 유저 정보가 없으면 main page로 이동 -> index.js
    // 로그인 하지 않으면 맛집 등록이 불가능
    if(!req.user){
        res.render('index',{user:"no"});
    } else{
        var userId = req.param('id');
        User.findOne({'_id':userId},function(err,newUser){ 
            if(err){throw err;}
            newUser.save(function(err){
                res.render('register',{user:newUser});
            });
        });
    }
});
// 맛집 등록 버튼 클릭 시
router.post('/register',upload.array('images'),function(req,res){
    var newStore = new Store();
    newStore.title = req.body.title;
    newStore.kind = req.body.kind;
    newStore.writer = req.user.nickname;
    newStore.address = req.body.address;
    newStore.opentime = req.body.opentime;
    newStore.closetime = req.body.closetime;
    newStore.reservation = req.body.reservation;
    newStore.phonenumber = req.body.phonenumber;
    // 이미지 파일 저장
    images = req.files;
    if(isSaved(images)){
        naming = renameUploadFile(newStore._id,images);
        for(var i=0;i<images.length;i++){
            newStore.images = naming.filepath[i];
        }
        newStore.save(function(err){
            if(err){
                console.error(err);
                res.json({result:0});
                return;
            }
            res.redirect('/'); // 저장 성공시 main page로 -> index.ejs
        });
    }
});
<<<<<<< HEAD
// 게시판 메뉴 -> board.ejs로 이동
router.get('/board',function(req,res){
    var userId = req.param('id');
    User.findOne({'_id':userId},function(err,newUser){ 
        if(err){throw err;}
        newUser.save(function(err){
            // 최근 날짜 순으로 rawContents 변수에 저장
            Store.find({}).sort({date:-1}).exec(function(err,rawContents){
=======
// 맛집 클릭 시 -> store.ejs
router.get('/store',function(req,res){
    // 파라미터로 넘겨받은 값 변수에 저장
    var storeTitle = req.param('id1');
    // reviews table에서 해당 id를 가진 정보 찾아서 rawContent 변수에 저장
 Review.find({'storetitle':storeTitle}).sort({date:-1}).exec(function(err,rawReview){
        if(err){throw err;}
        else {
            // stores table에서 변수 비교 후 rawContent 변수에 저장
            Store.findOne({'title':storeTitle},function(err,rawContent){ 
>>>>>>> 817880fcc3dd3571c26dcb6f09487261d2cbd0f5
                if(err){throw err;}
                res.render('board',{store:rawContents, user:newUser});
            });
        });
    });
});
// 맛집 클릭 시 -> store.ejs로 이동
router.get('/store',function(req,res){
    var storeId = req.param('id1');
    var userId = req.param('id2');
    User.findOne({'_id':userId},function(err,newUser){
        if(err){throw err;}
        Store.findOne({'_id':storeId},function(err,rawContent){ 
            if(err){throw err;}
            rawContent.count += 1; // 조회수 +1
            rawContent.save(function(err){
                // review db에서 storename에 해당하는 review들을 최근 날짜 순으로 newReview 변수에 저장
                Review.find({'storename':rawContent.title}).sort({date:-1}).exec(function(err,newReview){
                    if(err){throw err;}
                    res.render('store',{store:rawContent, user:newUser, review:newReview});
                });
            });
        });
    });
});
// review page -> review.ejs로 이동
router.get('/review', function(req,res){
    var storeId = req.param('id1');
    var userId = req.param('id2');
    User.findOne({'_id':userId},function(err,newUser){
        if(err){throw err;}
        newUser.save(function(err){
           Store.findOne({'_id':storeId},function(err,rawContent){ 
                if(err){throw err;}
                rawContent.save(function(err){
                    res.render('review',{store:rawContent, user:newUser});
                });
           }); 
        });
    });
});
// review 등록 시
router.post('/review',upload.array('images'),function(req,res){
    var newReview = new Review();
    newReview.grade = req.body.grade;
    newReview.storename = req.body.storename;
    newReview.content = req.body.content;
    newReview.writer = req.user.nickname;
    // 이미지 파일 저장
    images = req.files;
    if(isSaved(images)){
        naming = renameUploadFile(newReview._id,images);
        for(var i=0;i<images.length;i++){
            newReview.images = naming.filepath[i];
        }
        newReview.save(function(err){
            if(err){
                console.error(err);
                res.json({result:0});
                return;
            }
            res.redirect('/'); // 저장 성공시 main page로 -> index.ejs
        });
    }
});
// view page -> review 자세히 보기 -> image를 보기 위함 -> view.ejs로 이동
router.get('/view',function(req,res){
    var reviewId = req.param('id1');
    var userId = req.param('id2');
    User.findOne({'_id':userId},function(err,newUser){
        if(err){throw err;}
        Review.findOne({'_id':reviewId},function(err,newReview){ 
            if(err){throw err;}
            newReview.save(function(err){
                if(err){throw err;}
                res.render('view',{user:newUser, review:newReview});
            });
        });
    });
})
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
    var paramnickname = req.body.nickname || req.query.nickname;
    var paramgender = req.body.gender || req.query.gender;
    
    process.nextTick(function(){
        User.findOne({'username':username}, function(err, user){
            if(err) {return done(err);}
            if(user){
                return done(null, false, req.flash('signupmessage', 'Already Using Username'));
            } else{
                var newUser = new User({'username':username, 'password':password, 'nickname':paramnickname, 'gender':paramgender});
                newUser.save(function(err){
                    if(err) {throw err;}
                    return done(null,user);
                });
            }
        });
    });
}));
// update 함수
passport.use('update', new localStrategy({
    usernameField : 'username',
    passwordField : 'password',
    passReqToCallback : true }, function(req, username, password, done){
    var paramnickname = req.body.nickname || req.query.nickname;
    User.findOne({'_id':req.user._id}, function(err, user){
        if(err){return done(err);}
        user.username = username;
        user.password = password;
        user.nickname = paramnickname;
        user.save(function(err){
            if(err){throw err;}
            return done(null,user);
        });
    });
}));
passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(user, done){
    done(null, user);
});
function isSaved(file){
    var savedFile = file;
    var count=0;
    if(savedFile != null){
        for(var i=0;i<savedFile.length;i++){
            if(fs.statSync(getDirname(1) + savedFile[i].path).isFile()){
                count++;
            };
        }
        if(count==savedFile.length){
            return true;
        } else{
            return false;
        }
    } else{
        return true;
    }
}
function getDirname(num){
    var order = num;
    var dirname = __dirname.split('/');
    var result = "";
    for(var i=0;i<dirname.length-order;i++){
        result += dirname[i]+'/';
    }
    return result;
}
// 파일 path를 db에 저장하기 위해 필요한 함수
function renameUploadFile(itemId,upFile){
    // 업로드 할때 리네이밍 하는 곳!
    var renameForUpload = {};
    var newFile= upFile; // 새로 들어 온 파일
    var tmpPath = [];
    var tmpType = [];
    var index = [];
    var rename = [];
    var fileName = [];
    var fullName = []; // 다운로드 시 보여줄 이름 필요하니까 원래 이름까지 같이 저장하자!
    var fsName = [];
    var filepath = [];
    for (var i = 0; i < newFile.length; i++) {
        tmpPath[i] = newFile[i].path;
        tmpType[i] = newFile[i].mimetype.split('/')[1]; // 확장자 저장해주려고!
        index[i] = tmpPath[i].split('/').length;
        rename[i] = tmpPath[i].split('/')[index[i] - 1];
        fileName [i] = itemId + "_" + getFileDate(new Date()) + "_" + rename[i] + "." + tmpType[i]; // 파일 확장자 명까지 같이 가는 이름 "글아이디_날짜_파일명.확장자"
        fullName [i] = fileName[i] + ":" + newFile[i].originalname.split('.')[0]; // 원래 이름까지 같이 가는 이름 "글아이디_날짜_파일명.확장자:보여줄 이름"
        fsName [i] = getDirname(1)+"upload/"+fileName[i]; // fs.rename 용 이름 "./upload/글아이디_날짜_파일명.확장자"
        filepath [i] = "images/" + newFile[i].originalname;
    }
    renameForUpload.tmpname = tmpPath;
    renameForUpload.filename = fileName;
    renameForUpload.fullname = fullName;
    renameForUpload.fsname = fsName;
    renameForUpload.filepath = filepath;
    return renameForUpload;
}
// 현재 날짜 출력하는 함수
function getFileDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth()+1;
    var day = date.getDate();
    var hour = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var fullDate = year+""+month+""+day+""+hour+""+min+""+sec;
    return fullDate
}
module.exports = router;
