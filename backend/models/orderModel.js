const mongoose = require('mongoose')
const { addressSchema } = require('../models/usersModel')

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                quantity: {
                    type: Number,
                    required: true
                },
                price: {
                    type: Number,
                    default: 0
                }
            }
        ],
        shippingInfo: {
            type: addressSchema,
            required: true
        },
        paymentMethod: {
            type: String,
            enum: ["COD", "Razorpay"],
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending"
        },
        totalAmount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Confirmed","Pending", "Shipped", "Delivered", "Cancelled"],
            default: "Pending"
        },
        deliveredAt: { type: Date},
        razorpayOrderId: {
            type: String
        }
    },
    {
        timestamps: true
    }
)


module.exports = mongoose.model('Order', OrderSchema)