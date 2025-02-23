const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema(
    {
        street: {type: String, },
        city: {type: String, },
        state: {type: String, },
        country: {type: String,},
        zipCode: {type: String,},
        isDefault: { type: Boolean, default: false}
    }
)

const UsersSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["user", "admin", "SuperAdmin"],
            default: "user"
        },
        phone: {
            type: String,
            unique: true,
            sparse: true
        },
        addresses: [addressSchema],
        dateOfBirth: {
            type: Date
        },
        gender: {
            type: String,
            enum: ['Male', 'Female', 'Other']
        },
        isActive: {
            type: Boolean,
            default: true
        },
        resetPasswordToken: {
            type: String
        },
        resetPasswordExpires: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    },
)

module.exports = {
    User: mongoose.model('User', UsersSchema),
    addressSchema: addressSchema
}