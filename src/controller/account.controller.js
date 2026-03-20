const accountModel = require("../models/account.model")
const userModel = require("../models/user.model")
const transactionModel = require("../models/transaction_model")
const { sendEmailFile } = require("../services/email_services.js")
const dotenv = require('dotenv').config()
const file = require("fs");
const path = require("path");
const pdfGen = require("../services/generatePdf.js");

const createFolder = async ()=>{
    
    const filePath = path.join(__dirname,"../util")    
    if(!file.existsSync(filePath)){
        file.mkdirSync(filePath,{recursive : true});
        console.log("folder Created"); 
    }else{
        console.log("folder Already exits");
    }
    return filePath;
}
    

const createAccount = async function createAccount(req, res) {

    const data = req.body;
    const { userID, email } = req.user;

    console.log("Data from request : ", data)
    console.log("Data from request Body : ", userID, "  ", email);

    const user = await userModel.findOne({ _id: userID, email: email })
    console.log(user)

    try {

        const account1 = await accountModel.create({
            user: user._id,
            accountNo: data.accountNo,
            balance: data.balance,
            accountType: data.accountType,
            status: data.status
        });
        console.log(account1);
        const t1 = await transactionModel.create({
            transactionId: "TXN" + Date.now(),
            type: 'DEPOSIT',
            fromAccount: account1.accountNo
        })
        console.log(t1);
        res.status(200).json({ account1 })


    } catch (err) {
        console.log(err);
        res.status(400).json({ message: `${err}` })
    }

}

const getAllAccountInfo = async function getAllAccounts(req, res) {
    try {
        // userModel.find()
        const allAccount = await accountModel.find();
        console.log(allAccount);
        res.status(200).json({ allAccount });

    } catch (err) {
        console.log(err);
        res.status(400).json({ err })
    }
}

const getMyAccount = async function getMyAccountData(req, res) {
    const user = req.user
    console.log(user)
    try {

        const accountDtl = await accountModel.findOne({ user: user.userID })
        console.log("AC: ", accountDtl)
        res.status(200).json({ accountDtl })

    } catch (err) {
        console.log(err);
        res.status(404).json({ message: `Account not found ${err}` })
    }
}

const getAccountBalance = async function getBalance(req, res) {
    try {

        const accountNo1 = req.params.accountNo;
        // console.log(Number(accountNo1.value))
        // console.log(accountNo1)
        // console.log(typeof accountNo1)
        const accountDtl = await accountModel.findOne({ accountNo: accountNo1 });
        console.log("Account details : ", accountDtl)
        res.status(200).json({ balance: accountDtl.balance })
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: `Account not found ${err}` })
    }
}

const withdrawMoney = async function (req, res) {
    const { accountNo, amount } = req.body;
    console.log(amount, accountNo);
    console.log(typeof amount)
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Enter Correct Amount" })
    }
    try {

        const userAccount = await accountModel.findOne({ accountNo: accountNo });
        if (userAccount.balance < amount) {
            return res.status(400).json({ message: "insufficient balance." })
        }
        console.log("Balance : ", userAccount.balance);
        userAccount.balance -= amount;
        console.log("Balance : ", userAccount.balance);
        await userAccount.save();

        console.log("User account no : ", userAccount.accountNo);

        const t1 = await transactionModel.create({
            transactionId: "TXN" + Date.now(),
            type: "WITHDRAW",
            fromAccount: userAccount.accountNo,   
            amount: amount,
            status: "SUCCESS"
        });
        console.log(t1);

        return res.status(200).json({ message: "Account is debited of Amount: ", amount });

    } catch (err) {
        console.log(err)
        return res.status(404).json({ message: `error while withdraw money ${err}` })
    }
}

const depositMoney = async function (req, res) {

    const { accountNo, amount } = req.body;
    console.log(amount, accountNo);
    console.log(typeof amount)
    let amount1 = Number(amount)
    console.log(typeof amount1)

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Enter correct amount" })
    }

    try {

        const userAccount = await accountModel.findOne({ accountNo: accountNo });
        userAccount.balance += amount1;
        console.log("Current Balance :", userAccount.balance);
        await userAccount.save();

        const t1 = await transactionModel.create({
            transactionId: "TXN" + Date.now(),
            type: "DEPOSIT",
            fromAccount: userAccount.accountNo,  
            amount: amount,
            status: "SUCCESS"
        });
        console.log(t1);

        return res.status(200).json({ message: `account is credited of amount ${amount1} and Account balance is ${userAccount.balance}` });



    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: `error while deposit money ${err}` });
    }
}

const transferMoney = async function (req, res) {
    const { receiverNo, amount } = req.body;
    const {userID} = req.user;
    console.log("Data received by url : ", receiverNo, amount)
    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "enter correct amount." });
    }

    try {

        const senderAccount = await accountModel.findOne({ user: userID });
        console.log("sender Account info : ",senderAccount)
        const receiverAccount = await accountModel.findOne({ accountNo: receiverNo });

        if (!senderAccount)
            return res.status(400).json({ message: "provide correct sender Account info" })
        else if (!receiverAccount)
            return res.status(400).json({ message: "provide correct receiver Account info" });

        if (senderAccount.balance < amount) {
            return res.status(400).json({ message: "Sender has insufficient balance" });
        }
        let amount1 = Number(amount);
        senderAccount.balance -= amount1;
        receiverAccount.balance += amount1;

        await senderAccount.save();
        await receiverAccount.save();

        const t1 = await transactionModel.create({
            transactionId: "TXN" + Date.now(),
            type: 'TRANSFER',
            fromAccount: senderAccount.accountNo,
            toAccount: receiverAccount.accountNo,
            amount : amount1,
            status: "SUCCESS"
        })
        console.log(t1);
        return res.status(200).json({ message: `$${amount1} amount is transfer from ${senderAccount.accountNo} to ${receiverAccount.accountNo}` })

    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Error is occurring during transfer : ", err })
    }

}

const getAccountHistory = async function (req,res){
    const account = await accountModel.findOne({user : req.user.id});
    console.log("account details : ",account );
    const history = await transactionModel.find({
        $or:[
            {fromAccount : account.accountNo},
            {toAccount : account.accountNo}
        ]
    }).sort({createdAt : -1});

    console.log("history : ", history)
    res.json({history})
}


const generateStatement = async function(req,res){
    const acNo = req.body.accountNo
    const account = await accountModel.findOne({accountNo:acNo});
    console.log("Account info :",account)

    const {userID} = req.user;
    console.log("user oid : ",userID);

    const user1 = await userModel.findOne({_id:userID});
    console.log("user: ",user1);

    const transactions = await transactionModel.find({
        $or:[
            {fromAccount : account.accountNo},
            {toAccount : account.accountNo}
        ]
    }).sort({createdAt : -1})

    // console.log(transactions);

    const folderPath = await createFolder();
    const filePath = path.join(folderPath, `transaction_${Date.now()}.pdf`)
    pdfGen(transactions,filePath,user1, account)


    sendEmailFile(user1.email,filePath)


    // 4. Delete file (optional)
        // fs.unlinkSync(filePath);
    return res.status(200).json({message: "statement is sending in emails"})

}



module.exports = {
    createAccount,
    getAllAccountInfo,
    getMyAccount,
    getAccountBalance,
    withdrawMoney,
    depositMoney,
    transferMoney,
    getAccountHistory,
    generateStatement
};




    // let content = "--------Transaction statement -----\n\n";
    
    // transactions.forEach((txn , index) => {
    //     content +=`${index +1}. type: ${txn.type}\n`;
    //     if(txn.type === "DEPOSIT" || txn.type === "WITHDRAW"){
    //         content += `   from : ${txn.fromAccount}\n`
    //     }
    //     if(txn.type === "TRANSFER"){
    //         content += `   from     : ${txn.fromAccount}\n`
    //         content += `   to       : ${txn.toAccount}\n`
    //     }
    //     content += `   Amount   : ${txn.amount}\n`
    //     content += `   Date     : ${txn.createdAt.toLocaleString()}\n\n`;
    // });
    //     file.writeFile(filePath ,content, (error) =>{
    //     if(error){
    //         console.log("Error writing file: ", error)
    //     }else{
    //         console.log("File created successfully");
          
    //     }
    // })