const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    transactionId : {type: String, require:true},
    type:{
        type:String,
        enum: ['DEPOSIT', 'WITHDRAW','TRANSFER'],
        require : true
    },
    fromAccount:{ type: Number},
    toAccount:{ type: Number},

    amount : {type : Number , require : true},

    status : {
        type : String,
        enum : ['FAILED','SUCCESS'],
        default : 'SUCCESS'  
    },

},{
    timestamps : true
})

module.exports = new mongoose.model('Transaction_History', transactionSchema);
