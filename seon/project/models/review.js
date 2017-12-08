var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 몽구스 요청하고 필드 정의
var reviewSchema = new Schema({
    // 맛집 등록
    grade: String, // 평점
    storename: String, // 가게 이름
    content: String, // 내용
    writer: String, // 작성자 - nickname
    images: String, // 이미지 파일 경로
    date: {type:Date, default:Date.now} // 등록 시간
});
// 실제로 사용자 모델만들고 내보내기
module.exports = mongoose.model('review', reviewSchema);