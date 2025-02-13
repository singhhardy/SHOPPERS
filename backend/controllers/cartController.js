const asyncHandler = require('express-async-handler')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

// Add To Cart

const AddToCart = asyncHandler(async (req, res) => {
    const { productId, quantity} = req.body
    const { userId } = req.params

    const product = await Product.findById(productId)

    if(!product){
        res.status(400)
        throw new Error('Product Not Found')
    }

    let cart = await Cart.findOne({ userId })

    if(!cart){
        cart = new Cart({
            userId,
            items: [{ productId, quantity}]
        })
    } else {
        const existingItem = cart.items.find(item => item.productId.toString() === productId)
        if(existingItem){
            existingItem.quantity += quantity
        } else{
            cart.items.push({ productId, quantity})
        }
    }

    await cart.save()
    res.status(201).json({message: 'Item Added To Cart', cart})
})

module.exports = {
    AddToCart
}