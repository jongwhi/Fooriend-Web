var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 몽구스 요청하고 필드 정의
var userSchema = new Schema({
    username: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    nickname: {type:String, required:true, unique:true},
    gender: String,
    createdAt: {type:Date, default:Date.now},
});

// 실제로 사용자 모델만들고 내보내기
module.exports = mongoose.model('user', userSchema);