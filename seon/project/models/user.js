var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: String,
    password: String,
    nickname: String,
    gender: String
});

module.exports = mongoose.model('user',userSchema);