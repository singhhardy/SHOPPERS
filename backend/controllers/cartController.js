const asyncHandler = require('express-async-handler')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const calculateCartTotal = require('../utils/calcCartTotal')

// Add To Cart

const AddToCart = asyncHandler(async (req, res) => {
    const userId = req.user;
    const { productId, quantity, size } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(400).json({ error: 'Product not found' });
    }

    // Check if size is provided
    if (!size) {
        return res.status(400).json({ error: 'Size is required' });
    }

    // Validate the quantity
    if (quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    // Check if the selected size exists in the product's sizes array
    const selectedSize = product.sizes.find(s => s.size === size);
    if (!selectedSize) {
        return res.status(400).json({ error: 'Selected size is not available' });
    }

    // Validate if there is enough stock available for the selected size
    if (selectedSize.stock < quantity) {
        return res.status(400).json({ error: 'Not enough stock available for the selected size' });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({
            userId,
            items: [{
                productId,
                quantity,
                size,
                price: product.price,
                sizeStock: selectedSize.stock // Store the size-specific stock
            }]
        });
    } else {
        const existingItem = cart.items.find(
            item => item.productId.toString() === productId && item.size === size
        );

        // If the item already exists in the cart, update the quantity
        if (existingItem) {
            if (existingItem.quantity + quantity > selectedSize.stock) {
                return res.status(400).json({ error: 'Not enough stock available for the selected size' });
            }
            existingItem.quantity += quantity;
        } else {
            // If the item doesn't exist, add it to the cart
            cart.items.push({
                productId,
                quantity,
                size,
                price: product.price,
                sizeStock: selectedSize.stock // Store the size-specific stock
            });
        }
    }

    // Save the updated cart
    await cart.save();

    // Optionally populate product data, if needed for the response
    await cart.populate({
        path: 'items.productId',
        select: 'name description price image brand category countInStock'
    });

    res.status(201).json({ message: 'Item Added To Cart', cart });
});

// Remove Item From Cart
const RemoveFromCart = asyncHandler(async (req, res) => {
    const userId = req.user
    const { id } = req.params
    const product = await Product.findById(id)
    if(!product){
        res.status(400)
        throw new Error('Product Not Found')
    }

    let cart = await Cart.findOne({ userId})

    if(!cart){
        res.status(400)
        throw new Error('Cart Not found')
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== id);

    await cart.save()
    
    res.status(201).json({message: 'Item removed from the Cart', cart})
})

// Update User Cart

const UpdateCart = asyncHandler(async (req, res) => {
    const userId = req.user;
    const { productId, quantity, size } = req.body;

    if (quantity <= 0) {
        return res.status(400).json({ error: 'Invalid quantity' });
    }

    const product = await Product.findById(productId);
    if (!product) {
        return res.status(400).json({ error: 'Product Not Found' });
    }

    // Find the size object for the selected size
    const sizeObj = product.sizes.find(s => s.size === size);
    if (!sizeObj) {
        return res.status(400).json({ error: 'Selected size is not available' });
    }

    // Check if the requested quantity is available in the selected size
    if (sizeObj.stock < quantity) {
        return res.status(400).json({ error: 'Not enough stock available for the selected size' });
    }

    // Find the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.status(400).json({ error: 'Cart not found' });
    }

    // Find the cart item and update its quantity
    const cartItem = cart.items.find(item => item.productId.toString() === productId && item.size === size);
    if (cartItem) {
        // If the item is found, update the quantity
        cartItem.quantity = quantity;
    } else {
        // If the item is not found, add it to the cart
        cart.items.push({ productId, quantity, size, price: product.price, sizeStock: sizeObj.stock });
    }

    // Save the updated cart
    await cart.save();

    // Populate the cart with product details
    await cart.populate({
        path: 'items.productId',
        select: 'name description price image brand category countInStock sizes'
    });

    res.status(200).json({ message: "Cart Updated Successfully", cart });
});


// Get Cart Items

const GetCartItems = asyncHandler(async (req, res) => {
    const userId = req.user
    
    let cart = await Cart.findOne({userId}).populate({
        path: 'items.productId',
        select: 'name description price image brand category'
    });

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
    try{
        const total = await calculateCartTotal(req.user)
        res.status(200).json({ total })
    } catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})

// Clear Cart Items 
const ClearCart = asyncHandler(async ( req, res) => {
    const userId = req.user
    let cart = await Cart.findOne({ userId })

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