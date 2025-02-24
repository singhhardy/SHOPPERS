const asyncHandler = require('express-async-handler')
const Cart = require('../models/cartModel')
const calculateCartTotal = asyncHandler(async (userId) => {
    let cart = await Cart.findOne({userId}).populate("items.productId", "price")
    if(!cart){
        throw new Error('Cart Not Found')
    }
    
    return cart.items.reduce((acc, item) => acc + (item.quantity * item.productId.price), 0);
})

module.exports = calculateCartTotal