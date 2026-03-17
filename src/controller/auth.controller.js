const userModel = require("../models/user.model")
const jwt = require("jsonwebtoken")
const {encryption , decryption} = require('../services/encryption_decryption.js')
const {generateToken, verifyToken} = require("../services/jwt_services.js")

console.log("you are in the auth controller")
const getUser = function getUser(req,res){
    const {password} = req.body;
    console.log(typeof password)
    console.log(decryption(password))
    res.status(200).json({msg:"Get user data."})
    console.log("get user data");
}

const userRegistration = async function userRegisterController(req,res){
    const {email, name, password} = req.body;
    console.log(`Email ${email} , username: ${name}, password ${password}`);
    const isExists = await userModel.findOne({email : email})
    
    if(isExists){
        return res.status(422).json({
            message: "user already exists with email.",
            status : "failed"
        })
    }

    const encryptPass = encryption(password);
    console.log(password)
    console.log(encryptPass)
    // password = encryptPass

    const user1 = await userModel.create({email, name , password :encryptPass});

    const token = jwt.sign({userID : user1._id},process.env.JWT_SECRET)

    res.cookie("token",token)

    res.status(201).json({
        user:{
            _id: user1._id,
            email:user1.email,
            name: user1.name
        },token

    })
}

const login = async function loginUser(req,res){

    const {email , password} = req.body;
    console.log(email,password);
    
    if(!email || !password ){
        return res.status(400).json({message : " Email and Password is required"})
    }

    const user = await userModel.findOne({email});
    console.log(user);

    if(!user){
        return res.status(400).json({message:"Invalid email and password"})
    }

    const isValidPassword = decryption(user.password) == password;

    console.log(isValidPassword);

    if(!isValidPassword){
        return res.status(401).json({message: "Invalid password"})
    }
    
    const token = generateToken({id : user._id , email : email});
    console.log(token)
    res.json({user,token});

}


module.exports = {
    userRegistration,
    getUser,
    login
}

