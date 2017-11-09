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

module.exports = router;
