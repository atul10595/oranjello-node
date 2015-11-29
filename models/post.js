var mongoose = require('mongoose');

var PostSchema = mongoose.Schema({
    
    user_id: String, //fb id
	title: String,
    body: String,
    img_url: String,
    likes:{type:Number, default:1},
    liked_by:[String],
    flag:[String],
    disliked_by:[String],
    date: Date

});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
