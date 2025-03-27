const {User} = require('../models/usersModel')
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); 
};

const RegisterUser = asyncHandler(async (req, res) => {
  try {
      const { email, phone, password } = req.body;

      const userExists = await User.findOne({ email, phone });
      if (userExists) {
          return res.status(400).json({ error: 'User already exists' });
      }

      // Generate OTP
      const otp = generateOTP();
      const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
          email,
          phone,
          password: hashedPassword,
          otp,
          otpExpires,
          isVerified: false 
      });

      await sendEmail({
          to: email,
          subject: 'Email Verification - SHOPPER',
          text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
          html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for <strong>10 minutes</strong>.</p>`
      });

      res.status(201).json({
          message: 'OTP sent to your email. Please verify to complete registration.',
          userId: user._id
      });

  } catch (error) {
      console.error('Error in RegisterUser:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Verify OTP

const verifyOTP = asyncHandler(async (req, res) => {
  try {
      const { email, otp, type } = req.body; 

      const user = await User.findOne({ email });
      if (!user) {
          return res.status(400).json({ error: 'User not found' });
      }

      if (Number(user.otp) !== otp || user.otpExpires < Date.now()) {
          return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      if (type === 'register') {
          user.isVerified = true;
      } else if (type === 'reset-password') {
          return res.status(200).json({ message: 'OTP verified. Proceed with password reset.' });
      } else if (type === '2fa') {
          return res.status(200).json({ message: '2FA successful. Proceed with login.' });
      } else {
          return res.status(400).json({ error: 'Invalid OTP type' });
      }

      user.otp = undefined;
      user.otpExpires = undefined;
      await user.save();

      res.status(200).json({ message: 'OTP verified successfully!' });

  } catch (error) {
      console.error('Error in verifyOTP:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Resend OTP
const resendOTP = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    const newOTP = generateOTP();
    user.otp = newOTP;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    await sendEmail({
      to: email,
      subject: 'Email Verification - SHOPPER',
      text: `Your new OTP Code`,
      html: `<p>Your OTP code is <strong>${newOTP}</strong>. It is valid for <strong>10 minutes</strong>.</p>`
  });

  res.status(200).json({ message: "OTP resent successfully!" });
  } catch (error) {
    console.error("Error in resendOTP:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


// LOGIN USER 

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, } = req.body

  const user = await User.findOne({email})

  if(user && (await bcrypt.compare(password, user.password))){
    res.status(200).json({
      _id: user._id,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
      message: `User Logged in successfully`
    })
  } else{
    res.status(400)
    throw new Error('Invalid Credentials')
  }

})

// Forgot Password 
const forgotPassword = asyncHandler(async(req,res) => {
  const { email } = req.body
  const user = await User.findOne({ email })
  if(!user){
    res.status(400)
    throw new Error('User not found')
  }

  const newOTP = generateOTP();
  user.otp = newOTP;
  user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); 

  await user.save();

    await sendEmail({
      to: email,
      subject: 'Email Verification - SHOPPER',
      text: `PASSWORD RESET OTP`,
      html: `<p>Your OTP code is <strong>${newOTP}</strong>. It is valid for <strong>10 minutes</strong>.</p>`
  });

  res.status(200).json({ message: "OTP resent successfully!" });
})

// Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    res.status(400);
    throw new Error("Invalid or expired OTP");
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  user.otp = null;
  user.otpExpires = null;

  await user.save();

  user.otp = null;
  user.otpExpires = null;

  res.status(200).json({ message: "Password reset successful!" });
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

module.exports = {
  RegisterUser,
  loginUser,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword
}