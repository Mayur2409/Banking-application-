const express = require('express');
const router = express.Router()
const AccountController =  require('../controller/account.controller.js');


router.post("/create",AccountController.createAccount);
router.get('/allAccount',AccountController.getAllAccountInfo);
router.get('/my-account',AccountController.getMyAccount);
router.get('/getBalance/:accountNo',AccountController.getAccountBalance);
router.post('/withdraw',AccountController.withdrawMoney);
router.patch('/deposit',AccountController.depositMoney);
router.patch('/transfer-Money',AccountController.transferMoney);
router.get('/history', AccountController.getAccountHistory);
router.post('/GetStatement', AccountController.generateStatement),





module.exports = router;
