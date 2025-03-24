const asyncHandler = require('express-async-handler')
const Cart = require('../models/cartModel')
const { User } = require('../models/usersModel')
const Order = require('../models/orderModel')
const calculateCartTotal = require('../utils/calcCartTotal')
const Product = require('../models/productModel')
const sendEmail = require('../utils/sendEmail')

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
    if(!cart || cart.items.length === 0){
        res.status(400)
        throw new Error('Cart is empty')
    }

    const productId = cart.items.map(item => item.productId)
    const products = await Product.find({ _id: { $in: productId } });

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

    const productDetails = products.map(product => 
        `<div style="border: 1px solid #fff; border-radius: 8px;">
            <p><strong>Product:</strong> ${product.name}</p>
            <p><strong>Price:</strong> $${product.price}</p>
        </div>`
        ).join('');

    await sendEmail({
        to: user.email,
        subject: 'ORDER PLACED - SHOPPERS',
        text: `Your order has been placed successfully.`,
        html: `
            <div>
                <h1>Thank you for Shopping with us!</h1>
                <p>Thank you for ordering from <b>SHOPPERS</b>.
                Your order will be delivered within 5 to 7 days to your address.</p>
                <div>
                    <h4>Address :</h4>
                    <p>${order.shippingInfo.street}, ${order.shippingInfo.city}, 
                    ${order.shippingInfo.state}, ${order.shippingInfo.country}, ${order.shippingInfo.zipCode}</p>
                </div>
                <h5>Your Orders</h5>
                    <div>${productDetails}</div>
                    <p style="text-align:end">Total Amount: $${totalAmount}</p>
            </div>
        `
    });

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