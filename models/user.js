var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    points:{type:Number,default:2000},
    name: String,
    fb_id: String
});

mongoose.model('User', UserSchema);