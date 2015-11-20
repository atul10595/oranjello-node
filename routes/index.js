var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var post = mongoose.model('Post');
/* GET home page. */
router.get('/', function (req, res) {
    // res.render('index', { title: 'Express' });

    res.send({
        "name": "Atul"
    });
});
router.route('/api/posts')
    .get(function (req, res) {
        post.find(function (err, posts) {
            if (err) {
                return res.send(err);
            }
            return res.send(posts);
        });
    })
    .post(function (req, res) {
        var newpost = new post();
        newpost.user_id = req.body.user_id;
        newpost.title = req.body.title;
        newpost.body = req.body.body;
        newpost.img_url = req.body.img_url;
        newpost.date = req.body.date;
        newpost.save(function (err, post) {
            if (err) {
                return res.send({
                    state: 'fail',
                    error: err
                });
            }
            return res.send({
                state: 'ok',
                post: post
            });
        });
    });


module.exports = router;