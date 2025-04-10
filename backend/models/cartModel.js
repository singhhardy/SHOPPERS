const mongoose = require('mongoose')

const cartItemSchema = mongoose.Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        // price: {
        //     type: Number,
        //     required: true,
        // }
        sizeStock: {
            type: Number,
            required: true
        },
        size: { 
            type: Number, 
            required: true 
        }
    },
    {
        _id: false
    }
)

const cartSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        items: [cartItemSchema]
    },
    {timestamps: true}
)

const Cart = mongoose.model('Cart', cartSchema)

module.exports = Cart