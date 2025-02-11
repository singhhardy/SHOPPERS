const mongoose = require('mongoose')

const User = new mongoose.Schema(
    {
        Phone: {
            type: Number,
            required: true,
            unique: true,
            validate: {
                validator: function(v){
                    var r = '/\d{10}'
                    return r.test(v)
                },
                message: props => `${props.value} is not a valid phone number!`
            }
        },
        otp: {
            type: Number,
        },
        otpExpires: {
            type: Date,
        },
        isGuest: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User', User)