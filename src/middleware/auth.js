const jwt = require('jsonwebtoken');
const {verifyToken} = require('../services/jwt_services.js') 

module.exports = function(req,res,next){
    const authorization = req.headers.authorization?.split(" ")[1];

    if(!authorization){
        res.status(401).json({message:"token is not provided"})
    }
    const token = authorization;
  
    try{
        const decoded = verifyToken(token);

        req.user = decoded;

        next();
    }catch(err){
        res.status(401).json({message :  "invalid token"})
    }
}