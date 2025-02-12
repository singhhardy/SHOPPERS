const express = require('express')
const router = express.Router();
const { RegisterUser, loginUser } = require('../controllers/authController');

router.route('/email-signup').post(RegisterUser)
router.route('/login').post(loginUser)

module.exports = router