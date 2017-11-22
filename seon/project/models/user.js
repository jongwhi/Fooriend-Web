var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var SALT_FACTOR = 10;

var userSchema = new Schema({
    username: String,
    password: String,
    nickname: String,
    gender: String
});

userSchema.methods.name = function(){
    return this.displayName || this.username;
};
var noop = function(){};

userSchema.pre("save",function(done){
    var user = this;
    if(!user.isModified("password")){
        return done();
    }
    bcrypt.genSalt(SALT_FACTOR,function(err,salt){
        if(err){return done(err);}
        bcrypt.hash(user.password, salt, noop, function(err, hashedPassword){
            if(err){return done(err);}
            user.password = hashedPassword;
            done();
        });
    });
});

userSchema.methods.checkPassword = function(err, salt){
    bcrypt.compare(guess, this.password, fuction)
}

module.exports = mongoose.model('user',userSchema);