const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')

// GET ALL PRODUCTS
const getAllProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({})
    res.json(products)
})

// ADD NEW PRODUCT
const AddNewProduct = asyncHandler(async(req, res) => {
    const { user, name, category, brand, description, price, countInStock } = req.body
    
    if(!user || !name || !brand || !description || !price || !countInStock){
        res.status(400)
        throw new Error(`Please Enter All Fields`)
    }

    if (!["SuperAdmin", "admin"].includes(req.user.role)) {
        return res.status(403).json({
            message: "Only Admins & SuperAdmins can Add a product"
        });
    }

    const product = new Product({
        // user,
        name,
        category,
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

// EDIT A PRODUCT

const editProduct = asyncHandler(async (req, res) => {
    const { user, name, brand, description, price, countInStock } = req.body
    const { id } = req.params;

    if(!user || !name || !brand || !description || !price || !countInStock){
        res.status(400)
        throw new Error(`Please Enter All Fields`)
    }

    if (!["SuperAdmin", "admin"].includes(req.user.role)) {
        return res.status(403).json({
            message: "Only Admins & SuperAdmins can update a product"
        });
    }

    const product = await Product.findOne({ _id: id})

    if(!product){
        res.status(400)
        throw new Error(`Product Not found`)
    }

    product.user = user;
    product.name = name;
    product.brand = brand;
    product.description = description;
    product.price = price;
    product.countInStock = countInStock;

    const updatedProduct = await product.save()

    res.status(201).json({
        message: "Product Updated Successfully",
        product: updatedProduct
    })
})

// DELETE A PRODUCT
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    const product = await Product.findOne({_id: id})

    if (!["SuperAdmin", "admin"].includes(req.user.role)) {
        return res.status(403).json({
            message: "Only Admins & SuperAdmins can delete a product"
        });
    }

    if(product){
        await product.deleteOne()
        res.status(200).json({
            message: 'Product Deleted Successfuly'
        })
    } else{
        throw new Error(`Product Not Found!`)
    }
})

module.exports = {  
    getAllProducts,
    AddNewProduct,
    deleteProduct,
    editProduct
}