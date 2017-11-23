var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// 몽구스 요청하고 필드 정의
var storeSchema = new Schema({
    title: String, // 맛집 이름
    //writer: String, // 작성자 - nickname
    address: String, // 맛집 주소
    opentime: String, // 영업 시간 - 오픈
    closetime: String, // 영업 시간 - 클로즈
    reservation: String, // 예약 가능 여부
    phonenumber: String, // 전화번호 - 예약 가능 할 시 입력
    //images: String, // 이미지 파일 경로
    count: {type:Number, default:0}, // 조회수
    date: {type:Date, default:Date.now} // 등록 시간
});
// 실제로 사용자 모델만들고 내보내기
module.exports = mongoose.model('store', storeSchema);