const asyncHandler = require('express-async-handler')
const Users = require('../models/usersModel')

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
    const {userId } = req.params
    const user = await Users.findOne({userId})
    if(!user){
        res.status(400)
        throw new Error('User Not found')
    }

    await user.deleteOne()

    res.status(201).json({message: 'User Deleted Successfully', })
})

const GetUserProfile = asyncHandler(async (req, res) => {
    const {userId} = req.params
    const user = await Users.findOne(userId)
    if(!user){
        res.status(400)
        throw new Error('User Not found')
    }

    res.status(200).json({user})
})

// Edit User Profile

const EditUserProfile = asyncHandler(async(req, res) => {
    const {userId} = req.params
    const { firstName, lastName, role, phone, address, dateOfBirth, gender, isActive } = req.body;
    const user = await Users.findOne(userId)
    if(!user){
        res.status(400)
        throw new Error('User Not found')
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // if(role && req.user.role !== 'SuperAdmin'){
    //     return res.status(403).json({
    //         message: "User Data Saved. Role can only be updated by a SuperAdmin"
    //     })
    // }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.phone = phone || user.phone
    user.address = address || user.address
    user.dateOfBirth = dateOfBirth || user.dateOfBirth
    user.gender = gender || user.gender
    user.isActive = isActive || user.isActive

    const UpdatedUser = await user.save()
    res.status(200).json({
        message: 'User profile updated successfully',
        UpdatedUser
    });
})

module.exports = {
    GetAllUsers,
    DeleteUserById,
    GetUserProfile,
    EditUserProfile
}