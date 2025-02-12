const User = require('../models/UserModel')
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const RegisterUser = asyncHandler(async (req,res) => {
  const { email, password } = req.body

  const userExists = await User.findOne({email})

  if(userExists){
    res.status(400)
    throw new Error('User Already Exists')
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = await User.create({
    email,
    password: hashedPassword
  })

  if(user){
    res.status(201).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id)
    })
  } else {
    res.status(400)
    throw new Error('Invalid User Data')
  }
})

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({email})

  if(user && (await bcrypt.compare(password, user.password))){
    res.status(200).json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
      message: `User Logged in successfully`
    })
  } else{
    res.status(400)
    throw new Error('Invalid Credentials')
  }

})

const generateToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

module.exports = {
  RegisterUser,
  loginUser
}