const express = require('express')
const router = express.Router();
const { RegisterUser } = require('../controllers/authController');

router.route('/email-signup').post(RegisterUser)


module.exports = router