const asyncHandler = require('express-async-handler')
const { User } = require('../models/usersModel')
const bcrypt = require('bcryptjs')

// Get All Users
const GetAllUsers = asyncHandler(async (req, res) => {
    try{
        const users = await User.find()
        res.status(200).json(users);
    } catch(err){
        res.status(500).json({message: "Server error", err});
    }
})


// Get User Profile

const GetProfile = asyncHandler(async (req, res) => {
    const user = req.user
    res.status(200).json({message: "User Profile", user})
})


// Delete User

const DeleteUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id
    const user = await User.findById(userId)
    if(!user){
        res.status(400)
        throw new Error('User Not found')
    }

    await user.deleteOne()

    res.status(201).json({message: 'User Deleted Successfully', })
})

const GetUserProfile = asyncHandler(async (req, res) => {
    const userId = req.params.id
    const user = await User.findById(userId)
    if(!user){
        res.status(400)
        throw new Error('User Not found')
    }

    res.status(200).json({user})
})

// Edit User Profile ( to be fixed )

const EditUserProfile = asyncHandler(async(req, res) => {
    const userId = req.params.id
    const loggedInUser = req.user
    const { firstName, lastName, role, phone, addresses, dateOfBirth, gender, isActive } = req.body;
    const user = await User.findById(userId)
    if(!user){
        res.status(400)
        throw new Error('User Not found')
    }

    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    let roleWarning = null

    if(role && loggedInUser.role !== 'SuperAdmin'){
        roleWarning = "Role can only be updated by a SuperAdmin"        
    } else if(role){
        user.role = role || user.role
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.phone = phone || user.phone
    user.dateOfBirth = dateOfBirth || user.dateOfBirth
    user.gender = gender || user.gender

    if(addresses && Array.isArray(addresses)){
        user.addresses = addresses
    }

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
    const userId = req.user
    const user = await User.findById(userId)

    if(!user){
        res.status(400)
        throw new Error("User not authenticated");
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

// Add New Address

const AddNewAddress = asyncHandler(async (req, res) => {
    const { address } = req.body;
    const userId = req.user
    const user = await User.findById(userId)
    
    if (!address || typeof address !== "object") {
        return res.status(400).json({ message: "Invalid address format" });
    }

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push(address); 
    await user.save();

    console.log("User after adding address:", user);

    res.status(201).json({
        message: "Address Added Successfully",
        user,
    });
});

module.exports = {
    GetAllUsers,
    DeleteUserById,
    GetUserProfile,
    EditUserProfile,
    ChangePassword,
    AddNewAddress,
    GetProfile
}