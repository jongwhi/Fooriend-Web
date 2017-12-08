var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// 몽구스 요청하고 필드 정의
var userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    nickname: {type: String, required: true, unique: true},
    gender: String,
<<<<<<< HEAD
    createdAt: {type:Date, default:Date.now}
=======
    createdAt: {type: Date, default: Date.now}
>>>>>>> 817880fcc3dd3571c26dcb6f09487261d2cbd0f5
});

// 실제로 사용자 모델만들고 내보내기
module.exports = mongoose.model('user', userSchema);