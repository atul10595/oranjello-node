// Route for GET and POST related to User

var express = require('express');
var router = express.Router();

var User = require('../models/user.js');
var async = require('async');



/* POST users listing. */
router.post('/api/update', function(req, res, next) {
  
  var userFbId = req.body.userid; // make sure that android has key-value pair as {"userid":fbId}

  // res.send('respond with a resource');
});

module.exports = router;







/********** extras  */
function pop(str){ console.log("\n=====================[ "+str+" ]=======================\n")}
