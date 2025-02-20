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

const UpdateAllUsers = asyncHandler(async (req, res) => {
    try {
        console.log("Request User:", req.user);

        const { userId } = req.params;
        const { firstName, lastName, password, role, phone, address, dateOfBirth, gender, isActive } = req.body;

        const user = await Users.findById(userId);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (role) {
            if (!req.user || req.user.role !== "SuperAdmin") {
                return res.status(403).json({ message: "Only SuperAdmin can change roles" });
            }
        }

        const updatedUser = await Users.findByIdAndUpdate(userId, {
            firstName,
            lastName,
            password,
            phone,
            address,
            dateOfBirth,
            gender,
            isActive,
            ...(role && req.user.role === "SuperAdmin" ? { role } : {}) 
        }, { new: true, runValidators: true });

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
});




module.exports = {
    GetAllUsers,
    UpdateAllUsers
}