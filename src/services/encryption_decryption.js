const dotenv = require('dotenv').config()
const crypto = require('crypto')

const algo = process.env.CRYPTO_ALGO
const key = Buffer.from(process.env.CRYPTO_KEY,'hex');
const iv = Buffer.from(process.env.CRYPTO_IV,'hex');


 function encryption(data){
    const cipher = crypto.createCipheriv(algo,key,iv);
    let encrypted = cipher.update(JSON.stringify(data),'utf8','hex');
    encrypted += cipher.final('hex');
    return encrypted;  
}

function decryption(encryptedData){
    const decipher = crypto.createDecipheriv(algo,key,iv);
    let decrypt = decipher.update(encryptedData, 'hex','utf8');
    decrypt = decipher.final('utf8');
    return JSON.parse(decrypt);
}

module.exports = {encryption , decryption}
