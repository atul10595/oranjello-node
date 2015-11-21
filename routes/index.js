var formidable = require('formidable');
var fs = require('fs');
var basicAuth = require('basic-auth');

var Post = require('../models/post.js');

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

module.exports = function(app, bodyParser) {




    // app.get('*', function())

    app.get('/', auth, function(req, res) {
        // res.render('index', { title: 'Express' });

        res.send({
            "name": "You are at home!"
        });
    });


    var jsonParser = bodyParser.json();

    app.post('/upload', function(req, res) {
        console.log(req.body);
        res.send({
            "id": "this has been shifted to /uploadfiles!"
        });
    });


    // app.post('/uploadfiles', function(req, res){
    // 	console.log(req.files);
    // 	res.send({"id":"Hi Karan!"});
    // });

    app.post('/uploadfiles', auth, function(req, res) {

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
                        img_url: _imagePath.split('/').splice(0, 1).join('/'),
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
