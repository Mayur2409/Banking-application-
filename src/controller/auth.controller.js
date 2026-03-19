const userModel = require("../models/user.model")
const otpModel = require("../models/otp_model.js")
const jwt = require("jsonwebtoken")
const { encryption, decryption } = require('../services/encryption_decryption.js')
const { generateToken } = require("../services/jwt_services.js")
const { sendEmail, sendEmailOtp } = require("../services/email_services.js")

console.log("you are in the auth controller")
const getUser = function getUser(req, res) {
    const { password } = req.body;
    console.log(typeof password)
    console.log(decryption(password))
    res.status(200).json({ msg: "Get user data." })
    console.log("get user data");
}

const userRegistration = async function userRegisterController(req, res) {
    const { email, name, password } = req.body;
    const isExists = await userModel.findOne({ email: email })
    if (isExists) {
        return res.status(422).json({
            message: "user already exists with email.",
            status: "failed"
        })
    }
    const encryptPass = encryption(password);
    const user1 = await userModel.create({ email, name, password: encryptPass });

    res.status(201).json({
        user: {
            _id: user1._id,
            email: user1.email,
            name: user1.name
        }
    })
}

const login = async function loginUser(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: " Email and Password is required" })
    }
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email and password" })
    }
    const isValidPassword = decryption(user.password) == password;
    if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid password" })
    }
    const payload = { userID: user._id, email: email };
    const token = generateToken(payload);
    console.log(token)
    try {

        await sendEmailOtp(email);

    } catch (error) {
        console.log(" login Error : ", error);
    }
    res.json({ user, token });
}

const verifyOtp = async function (req, res) {
    const { email, otp } = req.body;

    console.log(email, otp);
    try {
        if (!email) {
            return res.status(404).json({ message: "Email is required" });
        } else if (!otp) {
            return res.status(404).json({ message: "OTP is required" })
        }
        const otpData = await otpModel.findOne({ email, otp });

        console.log(otpData)
        if (!otpData) {
            return res.status(404).json({ message: "Invalid OTP" })
        }
        if (otpData.expireAt < Date.now()) {
            return res.status(402).json({ message: "OTP expired" });
        }


        const user = await userModel.findOne({ email: email });
        console.log(user);
          if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        await otpModel.deleteMany({ email: email });
        user.isValid = true;
        await user.save();
        return res.status(200).json({ message: "otp is verify successfully" })


    } catch (error) {
        console.log(error);
        return res.status(404).json({ message: "Error verifying otp" })
    }
}


module.exports = {
    userRegistration,
    getUser,
    login,
    verifyOtp
}

