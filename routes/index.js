

var formidable = require('formidable');
var fs = require('fs');

module.exports = function(app, bodyParser) {




    app.get('/', function(req, res) {
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

    app.post('/uploadfiles', function(req, res) {

        var name, phone, email, ques;

        pop("111");
        var form = new formidable.IncomingForm();

        pop("222");
        form.parse(req, function(err, fields, files) {
            console.log(fields);
            console.log(files);
            pop("22-111");


            var temp_path = files.yolo_image.path;
            var imagePath = "public/images/" + files.yolo_image.name;


            // fs.createReadStream(temp_path).pipe(fs.createWriteStream(imagePath));

            var callback = function(status){

            	if(status)
            		res.send({"OK":"OK"});
				else
					{res.send({"NOT":"OK"});}
            }

			copyFile(temp_path, imagePath, callback);
				

            // form.on('end', function(err, fields) {
            //     // console.log(files);
            //     pop("33333");
            //     res.send({
            //         "id": "Hi Karan!"
            //     });

            //     //  res.end(util.inspect({fields: fields, files: files}));

            // });


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
        if (!cbCalled) {
            cb(err);
            cbCalled = true;

            // return false;
        }


    }
}
// }

