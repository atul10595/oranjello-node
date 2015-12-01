var formidable = require('formidable');
var fs = require('fs');
/// Include ImageMagick



var basicAuth = require('basic-auth');
var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var User = mongoose.model('User');
//var Post = require('../models/post.js');
//var User = require('../models/user.js');
var _fields, _files, _imagePath = null;
var auth = function(req, res, next) {
    function unauthorized(res) {
        res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
        return res.send(401);
    };

    var user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
        return unauthorized(res);
    };

    if (user.name === '28ezyn71g#Jjn#*p!2zn61289hsz$$@!#1' && user.pass === 'Bam') {
        return next();
    } else {
        return unauthorized(res);
    };
};




// these are the values that affect posts in the trend screen etc. in the app
var trendThreshold = 2, hotThreshold = 5;
module.exports = function(app, bodyParser) {
    // app.get('*', function())

    app.get('/', auth, function(req, res) {
        // res.render('index', { title: 'Express' });

        res.send({
            "name": "You are at home!"
        });
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    app.post('/api/user/store', function(req, res) {
        User.findOne({
            fb_id: req.body.fb_id
        }, function(err, user) {
            console.log('asdasdsadasdsadsa');
            if (err) {
                return err;
            }
            if (!user) {
                new User({
                    name: req.body.name,
                    fb_id: req.body.fb_id
                }).save(function(err, newuser) {
                    if (err) return err;
                    else {
                        return res.send({
                            status: 'ok',
                            newuser: newuser
                        });
                    }
                });
            }
        })
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.post('/api/posts/dislike', function(req, res) {
        Post.findById(req.body.post_id, function(err, post) {
            if (err) {
                return err;
            } else if ((post.liked_by.indexOf(req.body.fb_id) > -1) && (post.disliked_by.indexOf(req.body.fb_id) < 0)) {
                post.liked_by.splice(post.liked_by.indexOf(req.body.fb_id), 1);
                post.disliked_by.push(req.body.fb_id);
                post.likes = post.likes - 2;
                post.save(function(err) {
                    if (err) console.log('post point dint decrease.');
                    User.findOne({
                        fb_id: post.user_id
                    }, function(err, user) {
                        if (err) return err;
                    });
                    res.send(post);
                });
            } else if ((post.disliked_by.indexOf(req.body.fb_id) < 0) && (post.liked_by.indexOf(req.body.fb_id) < 0)) {
                post.disliked_by.push(req.body.fb_id);
                post.likes = post.likes - 1;
                post.save(function(err) {
                    if (err) console.log('post point dint decrease.');
                    res.send(post);
                });
            }
        });
    });

    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.post('/api/user/getname', function(req, res) {
        User.findOne({
            fb_id: req.body.user_id
        }, function(err, user) {
            if (err) console.log('error!');

            if(user){
            return res.send({
                username: user.name
            });
        }
        else{
            return res.send({
                username: "No Name"
            }); 
        }
        });
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.post('/api/posts/getvotes', function(req, res) {
        Post.findById(req.body.post_id, function(err, post) {
            if (err) console.log("sadasdasdasdasdasd");
            console.log(req.body);
            if (post) {
                res.send({
                    post_id: post._id,
                    votes: post.likes
                });
            }
        });
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    app.post('/api/posts/like', function(req, res) {
        flag = 0;
        Post.findById(req.body.post_id, function(err, post) {
            if (err) {
                return err;
            } else if ((post.liked_by.indexOf(req.body.fb_id) < 0) && (post.disliked_by.indexOf(req.body.fb_id) > -1)) {
                post.disliked_by.splice(post.disliked_by.indexOf(req.body.fb_id), 1);
                post.liked_by.push(req.body.fb_id);
                if (post.flag.indexOf(req.body.fb_id) < 0) {
                    post.liked_by.push(req.body.fb_id);
                    flag = 1;
                }
                post.likes = post.likes + 2;
                post.save(function(err) {
                    if (err) console.log('post point dint inc.');
                    if (flag === 1) {
                        User.findOne({
                            fb_id: post.user_id
                        }, function(err, user) {
                            if (err) console.log('user points dint inc');
                            user.points = user.points + 1;
                            user.save(function(err) {
                                if (err) console.log('user points dint inc');
                            });
                        });
                    }
                    res.send(post);
                });
            } else if ((post.disliked_by.indexOf(req.body.fb_id) < 0) && (post.liked_by.indexOf(req.body.fb_id) < 0)) {
                post.liked_by.push(req.body.fb_id);
                post.flag.push(req.body.fb_id);
                post.likes = post.likes + 1;
                post.save(function(err) {
                    if (err) console.log('post point dint inc.');
                    User.findOne({
                        fb_id: post.user_id
                    }, function(err, user) {
                        if (err) return err;
                        user.points = user.points + 1;
                        user.save(function(err) {
                            if (err) console.log('user points dint inc');
                        });
                    });
                    res.send(post);
                });
            }
        });
    });
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var jsonParser = bodyParser.json();

    app.post('/upload', function(req, res) {
        console.log(req.body);
        res.send({
            "id": "this has been shifted to /uploadfiles!"
        });
    });


    // app.post('/uploadfiles', function(req, res){
    //  console.log(req.files);
    //  res.send({"id":"Hi Karan!"});
    // });

    app.post('/uploadfiles', function(req, res) {

        var name, phone, email, ques;

        pop("111");
        var form = new formidable.IncomingForm();

        pop("222");
        form.parse(req, function(err, fields, files) {
            console.log(fields);
            _fields = fields;
            _files = files;

            console.log(files);
            pop("22-111");


            if (files.yolo_image) {
                var temp_path = files.yolo_image.path;
                var imagePath = "public/images/" + (new Date().getTime()) + "-" + files.yolo_image.name;
                _imagePath = imagePath;

            } else {
                var temp_path = null;

            }


            // fs.createReadStream(temp_path).pipe(fs.createWriteStream(imagePath));
            var callback = function(status) {
                console.log("Called callback status = " + status);
                if (status == true) {
                    var dt = new Date().getDate();

                    console.log("Called post function");
                    new Post({
                        user_id: _fields.userID,
                        title: _fields.title,
                        body: _fields.body,
                        img_url: _imagePath.split('/').splice(1, _imagePath.length - 1).join('/'),
                        liked_by: [],
                        disliked_by: [],
                        date: Date.now()
                    }).save(function(err, obj) {

                        if (!err) {

                            console.log(obj + "Post saved success!");

                        } else
                            throw err
                    });
                    res.send({
                        "OK": "OK"
                    });
                } else {
                    res.send({
                        "NOT": "OK"
                    });
                }
            }
            copyFile(temp_path, imagePath, callback);
        });

    });

    var noMorePostResponse = {
        status: -1,
        msg: "No More Posts"
    };
    // GET for latest posts in decreasingorder of date
    app.get('/newposts/hot/:q', function(req, res) {

        // console.log(req.param('q'));
        getPosts(req.param('q'), 0, function(post) {
            if (post != false)
                res.send(post);
            else
                res.send(noMorePostResponse);
        });

        // res.send("HEY");

    });

    // GET for all posts in reverse order of date
    app.get('/newposts/trending/:q', function(req, res) {

        // console.log(req.param('q'));
        getPosts(req.param('q'), 1, function(post) {
            if (post != false)
                res.send(post);
            else
                res.send(noMorePostResponse);
        });
    });
    app.get('/api/user/info/:user_id/:q', function(req, res) {

        console.log(req.params);
        console.log(req.params.q);
        getUserPosts(req.params.q, req.params.user_id, function(post) {
            if (post != false)
                res.send(post);
            else
                res.send(noMorePostResponse);
        });
    });

    // GET for latest posts sorted alphabetically by title
    app.get('/newposts/new/:q', function(req, res) {


        console.log('sadasdasdadsad' + req.param('q'));
        getPosts(req.param('q'), 2, function(post) {
            if (post != false)
                res.send(post);
            else
                res.send(noMorePostResponse);
        });

        // res.send("HEY");

    });
    // GET for latest posts sorted alphabetically by title
    app.post('/newposts/getcount', function(req, res) {

        console.log(req.body);
        var getcase = req.body.q;
        var q = req.body.user_id;

        
        
        if (getcase == 0) {
            console.log("Hello. 0 fi");

            Post.find({}).where('likes').gt(hotThreshold).sort('likes').exec(function(err, posts) {

                console.log("------- [" + getcase + "] -----" + posts.length);
                res.send({
                    "count": posts.length
                });
            });
        } else if (getcase == 1) {
            console.log("Hello. 1 fi");

            Post.find({}).where('likes').gt(trendThreshold).lt(hotThreshold).sort('likes').exec(function(err, posts) {
                console.log("------- [" + getcase + "] -----" + posts.length);
                res.send({
                    "count": posts.length
                });
            });
        } else if (getcase == 2) {

            console.log("Hello. 2 fi");

            Post.find({}).where('likes').gt(0).sort('likes').exec(function(err, posts) {
                console.log("------- [" + getcase + "] -----" + posts.length);

                res.send({
                    "count": posts.length
                });
            });
        }
        else if (req.body.user_id) {

            console.log("Hello. 3 fi");

            Post.find({
                user_id: req.body.user_id
            }).exec(function(err, posts) {  
                console.log("------- [" + getcase + "] -----" + posts.length);
                res.send({
                    "count": posts.length
                });
            });
        }



        // Post.count({}, function(err, count) {
        //     console.log("Number of docs: ", count);
        //     res.send({
        //         "count": count
        //     });
        //     // res.send("HEY");

        // });
    });
}
var getPosts = function(q, getcase, callback) {
    if (getcase === 0) {
        Post.find({}).where('likes').gt(hotThreshold).sort('likes').exec(function(err, posts) {
            if (q < posts.length)
                callback(posts[q]);
            else
                callback(false);
        });
    } else if (getcase === 1) {
        Post.find({}).where('likes').gt(trendThreshold).lt(hotThreshold).sort('likes').exec(function(err, posts) {
            if (q < posts.length)
                callback(posts[q]);
            else
                callback(false);
        });
    } else if (getcase === 2) {
        Post.find({}).where('likes').sort('-date').exec(function(err, posts) {
            if (q < posts.length)
                callback(posts[q]);
            else
                callback(false);
        });
    }
    // callback();
}
var getUserPosts = function(q, user_id, callback) {
    Post.find({
        user_id: user_id
    }).sort('-likes').exec(function(err, posts) {

        if (q < posts.length)
            callback(posts[q]);
        else
            callback(false);
    });

    // callback();
}

var getPostsSortedByTitle = function(q, callback) {

    Post.find({}).sort('title').exec(function(err, posts) {

        if (q < posts.length)
            callback(posts[q]);
        else
            callback(false);
    });
}


var pop = function(str) {
    console.log(str);

}




function copyFile(source, target, cb) {



    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });
    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });
    rd.pipe(wr);

    function done(err) {
        console.log("Called copyFile-dene");
        if (!cbCalled) {
            if (err)
                cb(err);
            else
                cb(true);
            cbCalled = true;


            // return false;
        }



    }
}
// }
