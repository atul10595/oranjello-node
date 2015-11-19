var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    
    name: String,
    fb_id: String
});

var User = mongoose.model('User', UserSchema);

module.exports = User;