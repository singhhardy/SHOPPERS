const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')

// GET ALL PRODUCTS

const getAllProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({})
    res.json(products)
})

const AddNewProduct = asyncHandler(async(req, res) => {
    const { user, name, brand, description, price, countInStock } = req.body
    
    if(!user || !name || !brand || !description || !price || !countInStock){
        res.status(400)
        throw new Error(`Please Enter All Fields`)
    }

    const product = new Product({
        user,
        name,
        brand,
        description,
        price,
        countInStock,
        image: '',
        reviews: [],
        rating: 0,
        numReviews: 0
    })

    const createdProduct = await product.save()

    res.status(201).json({
        success: true,
        message: "Product Added Successfuly",
        product: createdProduct
    })
})

module.exports = {  
    getAllProducts,
    AddNewProduct
}