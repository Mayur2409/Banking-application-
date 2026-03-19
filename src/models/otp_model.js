const mongoose = require("mongoose")

const otpSchema = mongoose.Schema({
    email : {
        type : String,
        require: true
    },
    otp :{
        type :String,
        require : true
    },
    expireAt: {
        type : Date ,
        require: true
    }
})

const otp = mongoose.model("OTP", otpSchema);

module.exports = otp;