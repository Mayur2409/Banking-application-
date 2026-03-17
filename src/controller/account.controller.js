const accountModel = require("../models/account.model")
const userModel = require("../models/user.model")
const dotenv = require('dotenv').config()

const createAccount = async function createAccount(req, res) {

    const data = req.body;
    const { id, email } = req.user;

    console.log("Data from request : ", data)
    console.log("Data from request Body : ", id, "  ", email);

    const user = await userModel.findOne({ _id: id, email: email })
    console.log(user)

    try{

        const account1 = await accountModel.create({
            user:user._id,
            accountNo : data.accountNo, 
            balance : data.balance,
            accountType: data.accountType,
            status : data.status
        });
        console.log(account1);
        
        res.status(200).json({account1})
        
    }catch(err){
        console.log(err);
        res.status(400).json({message: `${err}` })
    }

}

const getAllAccountInfo = async function getAllAccounts(req,res){
    try{
        // userModel.find()
        const allAccount = await accountModel.find();
        console.log(allAccount);
        res.status(200).json({allAccount});

    }catch(err){
        console.log(err);
        res.status(400).json({err})
    }
}

const getMyAccount = async function getMyAccountData(req,res){
    const user = req.user
    console.log(user)
    try{

        const accountDtl = await accountModel.findOne({user: user.id})
        console.log("AC: ",accountDtl)
        res.status(200).json({accountDtl})

    }catch(err){
        console.log(err);
        res.status(404).json({message :`Account not found ${err}` })
    }
}

const getAccountBalance = async function getBalance(req,res){
    try{

        const accountNo1 = req.params.accountNo;
        // console.log(Number(accountNo1.value))
        // console.log(accountNo1)
        // console.log(typeof accountNo1)
        const accountDtl = await accountModel.findOne({accountNo : accountNo1});
        console.log("Account details : ",accountDtl)
        res.status(200).json({balance : accountDtl.balance})
    }catch(err){
        console.log(err);
        res.status(404).json({message:`Account not found ${err}`})
    }
}

const withdrawMoney = async function(req,res){
    const {accountNo,amount} = req.body;
    console.log(amount,accountNo);
     console.log(typeof amount)
    if(!amount || amount <= 0 ){
        return res.status(400).json({message: "Enter Correct Amount"})
    }
    try{

        const userAccount = await accountModel.findOne({accountNo : accountNo});
        if(userAccount.balance < amount){
            return res.status(400).json({message: "insufficient balance."})
        }
        console.log("Balance : ",userAccount.balance); 
        userAccount.balance -= amount;
        console.log("Balance : ",userAccount.balance); 
        await userAccount.save();
        return res.status(200).json({message:"Account is debited of Amount: ", amount});

    }catch(err){
        console.log(err)
       return  res.status(404).json({message:`error while withdraw money ${err}`})
    }
}

const depositMoney = async function(req,res){

    const {accountNo, amount} = req.body;
    console.log(amount , accountNo);
    console.log(typeof amount)
    let amount1 = Number(amount)
    console.log(typeof amount1)

    if(!amount || amount <= 0){
        return res.status(400).json({message:"Enter correct amount"})
    }

    try{

        const userAccount = await accountModel.findOne({accountNo: accountNo});
        userAccount.balance += amount1;
        console.log("Current Balance :",userAccount.balance);
        await userAccount.save();
        return res.status(200).json({message: `account is credited of amount ${amount1} and Account balance is ${userAccount.balance}`});
        
    }catch(err){
        console.log(err);
       return  res.status(400).json({message: `error while deposit money ${err}`});
    }
}

const transferMoney = async function(req,res){
    const {senderNo , receiverNo, amount} = req.body;
    console.log("Data received by url : ", senderNo,  receiverNo , amount)
    if(!amount || amount <=0){
        return res.status(400).json({message : "enter correct amount."});
    }

    try{

        const senderAccount = await accountModel.findOne({accountNo : senderNo});
        const receiverAccount = await accountModel.findOne({accountNo : receiverNo});

        if(!senderAccount)
            return res.status(400).json({message:"provide correct sender Account info"})
        else if(!receiverAccount)
            return res.status(400).json({message:"provide correct receiver Account info"});
        
        if(senderAccount.balance < amount){
            return res.status(400).json({message:"Sender has insufficient balance"});
        }
        let amount1 = Number(amount);
        senderAccount.balance -= amount1;
        receiverAccount.balance += amount1;
        
        await senderAccount.save();
        await receiverAccount.save();
        return res.status(200).json({message: `$${amount1} amount is transfer from ${senderAccount.accountNo} to ${receiverAccount.accountNo}`})

    }catch(err){
        console.log(err);
        return res.status(400).json({message:"Error is occurring during transfer : ",err})
    }

}



module.exports = {
    createAccount,
    getAllAccountInfo,
    getMyAccount,
    getAccountBalance,
    withdrawMoney,
    depositMoney,
    transferMoney
};
