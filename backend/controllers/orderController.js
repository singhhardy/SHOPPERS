const asyncHandler = require('express-async-handler')
const Cart = require('../models/cartModel')
const { User } = require('../models/usersModel')
const Order = require('../models/orderModel')
const { ClearCart } = require('./cartController')
const calculateCartTotal = require('../utils/calcCartTotal')

// Get Checkout Data

const placeOrder = asyncHandler(async(req,res) => {
    const userId = req.user
    const { addressId, paymentMethod } = req.body
    const user = await User.findById(userId)

    if(!user){
        res.status(400)
        throw new Error('User not found')
    }


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
        totalAmount,
        status: "Pending",
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

// Users Order Info By Id
const OrderInfoById = asyncHandler(async (req, res) => {
    const orderId = req.params.id
    const order = await Order.findById(orderId)

    if(!order){
        res.status(400)
        throw new Error('Order not found')
    }

    res.status(200).json({order})

})

const OrderStatus = asyncHandler(async ( req, res) => {
    const orderId = req.params.id
    const order = await Order.findById(orderId)
    
    if(!order){
        res.status(400)
        throw new Error('Order not found')
    }

    const { status } = req.body

    order.status = status

    await order.save()
    res.status(201).json({
        message: status ===  "Cancelled" ? "Order Cancelled" : "Order Status Updated",
        order
    })
})

module.exports = {
    placeOrder,
    GetCustomerOrders,
    OrderInfoById,
    OrderStatus
}