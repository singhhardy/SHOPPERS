const express = require('express')
const router = express.Router();
const { RegisterUser, loginUser, verifyOTP, resendOTP } = require('../controllers/authController');

router.route('/email-signup').post(RegisterUser)
router.route('/login').post(loginUser)
router.route('/otp-verify').post(verifyOTP)
router.route('/resend-otp').post(resendOTP)

module.exports = router