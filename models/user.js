var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    
    name: String,
    fb_id: String
});

mongoose.model('User', UserSchema);