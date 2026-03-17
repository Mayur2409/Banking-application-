const jwt = require('jsonwebtoken')
require('dotenv').config()

const JWT_SECRET = process.env.JWT_SECRET;

function generateToken(payload){
    return jwt.sign(payload, JWT_SECRET,{expiresIn: "3d"});
} 

function verifyToken(token){
    try{
        return jwt.verify(token,JWT_SECRET)
    }catch(err){
        console.log("not verify token Error : ",err)
        res.status(404).json({message: "token is not valid "})
        // return null;
    }
}

module.exports = {
    generateToken ,
    verifyToken
}