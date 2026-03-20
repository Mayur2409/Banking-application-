const express = require('express');
const mailer = require('nodemailer');
const generateOtp = require('./generateOtp');
const dotenv = require('dotenv').config();
const otp_model = require('../models/otp_model.js');
const emailId = process.env.EMAIL_ID ;
const password = process.env.EMAIL_PASS;
const path = require('path')

const transport = mailer.createTransport({
    host:"smtp.gmail.com",
    port: 587,
    secure: false,
    auth:{
        user : emailId,
        pass : password
    },
    tls: {
        rejectUnauthorized : false
    }
});



const sendEmail= async function sendEmail(emailData) {
    console.log(emailData)
    const mailOption = {
        from : process.env.EMAIL_ID,
        to : emailData.to,
        subject : emailData.subject,
        text :emailData.body
    }

    try{
        const info = transport.sendMail(mailOption);
        return info;
    }catch(error){
        throw error  // pass this error to caller method (if in case the caller method is not handel this error then the application is crash).
        // return error; // the error is return as a normal value.
    }

}

const sendEmailOtp = async function sendEmailOtp(emailId){
    console.log(emailId);
    const otp = generateOtp()
    const mailOption={
        from : process.env.EMAIL_ID,
        to : emailId,
        subject : `Otp for Email verification `,
        text : `verification Otp is ${otp}`
    }
    console.log("mail options : ", mailOption);
    const expireAt = new Date(Date.now() + 5 *60 *1000); // (Date.now() + 5(minute) * 60(second) * 1000(ms))
    try{
        await otp_model.create({email : emailId ,otp : otp, expireAt : expireAt});
        const t = await transport.sendMail(mailOption);
        console.log(t)
        return ;
    }catch(error){
        throw error;
    }
}

const sendEmailFile = async function (emailId,filePath){
     const mailOption={
        from : process.env.EMAIL_ID,
        to : emailId,
        subject : `statement of the month. `,
        text : `statement data`,
        attachments:[
            {
                filename: path.basename(filePath),
                path:filePath
            }
        ]
    }

    try{
        const t = await transport.sendMail(mailOption);
        console.log(t);
    }catch(error){
        throw error;
    }
}

module.exports ={ sendEmail, sendEmailOtp,sendEmailFile}