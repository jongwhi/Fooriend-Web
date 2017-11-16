var express = require('express');
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
module.exports = router;
