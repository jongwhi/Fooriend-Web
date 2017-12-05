var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 몽구스 요청하고 필드 정의
var reviewSchema = new Schema({
    reviewtitle: String,
    storeid: String,
    writer: String,
    content: String,
    //reviewimages: String,
    date: {type:Date, default:Date.now} // 등록 시간
});
// 실제로 사용자 모델만들고 내보내기
module.exports = mongoose.model('review', reviewSchema);