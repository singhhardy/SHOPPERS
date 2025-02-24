const asyncHandler = require('express-async-handler')
const Cart = require('../models/cartModel')
const { User } = require('../models/usersModel')
const Order = require('../models/orderModel')
const { ClearCart } = require('./cartController')
const calculateCartTotal = require('../utils/calcCartTotal')

// Get Checkout Data

const OrderDetails = asyncHandler(async(req,res) => {
    const userId = req.user
    const { addressId, paymentMethod } = req.body
    const user = await User.findById(userId)

    if(!user){
        res.status(400)
        throw new Error('User not found')
    }

    console.log(userId, addressId, paymentMethod)

    const cart = await Cart.findOne({ userId })
    if(!cart){
        res.status(400)
        throw new Error('Cart is empty')
    }

    const address = user.addresses.id(addressId);
    if(!address){
        res.status(400)
        throw new Error('Invalid Address')
    }

    const totalAmount = await calculateCartTotal(userId)

    const order = new Order({
        userId,
        items: cart.items,
        shippingInfo: address,
        paymentMethod,
        totalAmount
    })

   await order.save()

   cart.items = []
   await cart.save()
   
   res.status(201).json({
        message: "Order placed Successfully",
        order
   })

})


// Get Customer Orders 

const GetCustomerOrders = asyncHandler(async (req, res) => {
    const userId = req.user
    const orders = await Order.find({ userId })

    if(!orders){
        res.status(400)
        throw new Error('Orders Not found')
    }

    res.status(200).json({ orders })
})

module.exports = {
    OrderDetails,
    GetCustomerOrders
}