var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000; //3000 for development and 80 for production
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var hogan = require('hogan-express');


//initiating app
var app = express();






//getting db url
var db = require('./models/db');

require('./models/post.js');
require('./models/user.js');
//-----------------------routes

var routes = require('./routes/index');
//var users = require('./routes/user');
//----------------------------------------



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html',hogan);

if (app.get('env') === 'development') {
    //connect to mongoose
    mongoose.connect(db.dev.url, function(err) {
        if (err) {
            throw err;
        } else
            console.log("mongoose:DEV connected");
    });
} else if (app.get('env') === 'production') {
    //connect to mongoose
    mongoose.connect(db.production.url, function(err) {
        if (err) {
            throw err;
        } else
            console.log("mongoose:PROD connected");
    });
}



// importing routes
var routes = require('./routes/index')(app, bodyParser);
var users = require('./routes/user');



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


// module.exports = app;

app.listen(port);
console.log('This web service is running at ' + port)
