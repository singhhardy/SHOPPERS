const asyncHandler = require('express-async-handler')
const Users = require('../models/usersModel')
const bcrypt = require('bcryptjs')

// Get All Users
const GetAllUsers = asyncHandler(async (req, res) => {
    try{
        const users = await Users.find()
        res.status(200).json(users);
    } catch(err){
        res.status(500).json({message: "Server error", err});
    }
})


// Delete User

const DeleteUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id
    const user = await Users.findById({userId})
    if(!user){
        res.status(400)
        throw new Error('User Not found')
    }

    await user.deleteOne()

    res.status(201).json({message: 'User Deleted Successfully', })
})

const GetUserProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id
    const user = await Users.findById(userId)
    if(!user){
        res.status(400)
        throw new Error('User Not found')
    }

    res.status(200).json({user})
})

// Edit User Profile

const EditUserProfile = asyncHandler(async(req, res) => {
    const userId = req.params.id
    const { firstName, lastName, role, phone, address, dateOfBirth, gender, isActive } = req.body;
    const user = await Users.findById(userId)
    if(!user){
        res.status(400)
        throw new Error('User Not found')
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    let roleWarning = null

    if(role && req.user.role !== 'SuperAdmin'){
        roleWarning = "Role can only be updated by a SuperAdmin"        
    } else if(role){
        user.role = role || user.role
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.phone = phone || user.phone
    user.address = address || user.address
    user.dateOfBirth = dateOfBirth || user.dateOfBirth
    user.gender = gender || user.gender
    if (typeof isActive !== "undefined") {
        user.isActive = isActive;
    }

    const UpdatedUser = await user.save()
    res.status(200).json({
        message: 'User profile updated successfully',
        roleWarning,
        UpdatedUser
    });
})

// CHANGE PASSWORD

const ChangePassword = asyncHandler(async (req, res) => {
    const { CurrPassword, NewPassword } = req.body
    const userId = req.params.id
    const user = await Users.findById(userId)

    if(!user){
        res.status(400).json({
            message: "User Not Found"
        })
    }

    const isMatch = await bcrypt.compare(CurrPassword, user.password);

    if (!isMatch) {
        return res.status(400).json({ message: "Incorrect Current Password" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(NewPassword, salt);

    await user.save()

    res.status(201).json({
        message: 'Password Updated Successfully',
    })

})


module.exports = {
    GetAllUsers,
    DeleteUserById,
    GetUserProfile,
    EditUserProfile,
    ChangePassword
}