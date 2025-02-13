const asyncHandler = require('express-async-handler')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')

// Add To Cart

const AddToCart = asyncHandler(async (req, res) => {
    const { productId, quantity, userId} = req.body
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
            existingItem.quantity += 1
        } else{
            cart.items.push({ productId, quantity})
        }
    }

    await cart.save()
    res.status(201).json({message: 'Item Added To Cart', cart})
})

// Remove Item From Cart
const RemoveFromCart = asyncHandler(async (req, res) => {
    const { productId, userId} = req.body
    const product = await Product.findById(productId)
    if(!product){
        res.status(400)
        throw new Error('Product Not Found')
    }

    let cart = await Cart.findOne({ userId})

    if(!cart){
        res.status(400)
        throw new Error('Cart Not found')
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId)

    await cart.save()
    
    res.status(201).json({message: 'Item removed from the Cart', cart})
})

// Update User Cart

const UpdateCart = asyncHandler(async (req, res) => {
    const { productId, quantity, userId } = req.body
    const product = await Product.findById(productId)
    if(!product){
        res.status(400)
        throw new Error('Product Not Found')
    }
    let cart = await Cart.findOne({userId})

    if(!cart){
        res.status(400)
        throw new Error('Cart not found')
    }

    const cartItem = cart.items.find(item => item.productId.toString() === productId)

    if(cartItem){
        cartItem.quantity = quantity
    } else{
        cart.item.push({ productId, quantity})
    }
    
    await cart.save();
    res.status(201).json({message: "Cart Updated Successfully", cart})
})

// Get Cart Items

const GetCartItems = asyncHandler(async (req, res) => {
    const {userId} = req.body
    
    let cart = await Cart.findOne({userId})
    if(!cart){
        res.status(400)
        throw new Error('Cart Not Found')
    }   
    
    res.status(201).json({
        cart,
        message: "Cart Items"
    })
})

// Get Cart Items Total
const GetCartTotal = asyncHandler(async (req, res) => {
    const { userId } = req.body
    let cart = await Cart.findOne({userId}).populate('items.productId', 'price')
    if(!cart){
        res.status(400)
        throw new Error('Cart Not found')
    }

    const total = cart.items.reduce((acc, item) => acc + item.quantity * item.productId.price, 0)

    res.status(200).json({total})
})

// Clear Cart Items 
const ClearCart = asyncHandler(async ( req, res) => {
    const { userId } = req.body
    let cart = await Cart.findOne({userId})

    if(!cart){
        res.status(400)
        throw new Error('Cart Not Found')
    }

    cart.items = []
    await cart.save()

    res.status(200).json({
        message: "Your cart is empty!"
    })

})

module.exports = {
    AddToCart,
    RemoveFromCart,
    UpdateCart,
    GetCartItems,
    GetCartTotal,
    ClearCart
}