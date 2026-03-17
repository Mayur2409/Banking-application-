const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user1",
        require: [true, "user is required to create the account"]
    },
    accountNo: {
        type: Number,
        required :true ,
        unique : [true , "Account number already exists."]
    },
    balance:{
        type : Number,
        require : true
    },
    accountType:{
        type : String,
        enum : ['savings',"current","Demat"],
        require : true,
        default : "savings"
    },
    status:{
        type : String,
        enum:{
            values : ["ACTIVE", "FROZEN", "CLOSED"],
            message :"Status must be ACTIVE, FROZEN or CLOSED"
        },
        default : "ACTIVE"
    }


    /* 
        accountNumber
        userId
        balance
        accountType
        createdAt
        status
    
    */
},{
    timeStamps:true
})

const accounts = mongoose.model('account',accountSchema);

module.exports = accounts;



