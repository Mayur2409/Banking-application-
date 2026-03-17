const express = require('express')
const router = express.Router();
const userController = require('../controller/auth.controller')

console.log("you are in the auth module")
router.post("/registration", userController.userRegistration);
router.post('/login',userController.login);
router.post("/", userController.getUser);
// router.get("/", userController.getUser);




module.exports = router;


