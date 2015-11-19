var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
var async = require('async');



/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;







/********** extras  */

function pop(str){ console.log("\n=====================[ "+str+" ]=======================\n")}
