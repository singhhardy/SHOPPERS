const User = require('../models/UserModel')
const asyncHandler = require('express-async-handler');

const loginUser = asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;
  
    // You can add your logic here for validating OTP or checking user existence
    const user = await User.findOne({ phone });
  
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
  
    // Add OTP validation logic (this is just a placeholder)
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
  
    // OTP is valid
    res.status(200).json({ message: `User with phone ${phone} logged in successfully` });
  });
module.exports = {
    loginUser
}