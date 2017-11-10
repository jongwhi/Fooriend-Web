var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET signup page. */
router.get('/regi', function(req, res, next) {
  res.render('regi', { title: 'Express' });
});
router.get('/board', function(req, res, next) {
  res.render('board', { title: 'Express' });
});
router.get('/store', function(req, res, next) {
  res.render('store', { title: 'Express' });
});
router.get('/lank', function(req, res, next) {
  res.render('lank', { title: 'Express' });
});
router.get('/search', function(req, res, next) {
  res.render('search', { title: 'Express' });
});
router.get('/review', function(req, res, next) {
  res.render('review', { title: 'Express' });
});

module.exports = router;
