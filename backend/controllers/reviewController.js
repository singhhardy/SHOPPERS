const asyncHandler = require('express-async-handler')
const Product = require('../models/productModel')

// Add a Review

const AddReview = asyncHandler(async(req,res) => {
    const userId = req.user._id
    const { id } = req.params
    const { comment, rating } = req.body

    const product = await Product.findById(id)
    if(!product){
        res.status(400)
        throw new Error('Product not found')
    }

    const alreadyReviewd = product.reviews.find(r => r.user.toString() === userId.toString())

    if(alreadyReviewd){
        res.status(400)
        throw new Error('You have already reviewed this product')
    }

    const review = {
        user: userId,
        rating: rating,
        comment,
    }

    product.reviews.push(review)
    product.numReviews = product.reviews.length
    
    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = product.numReviews > 0 ? totalRating / product.numReviews : 0;

    await product.save()

    res.status(201).json({
        message: 'Review Added Successfully',
        review
    })
})

const GetAllReviews = asyncHandler(async (req, res) => {
    const {id} = req.params
    const product = await Product.findById(id).populate({
        path: "reviews.user",
        select: "firstName lastName email"
    })
    if(!product){
        res.status(400)
        throw new Error('Product not found')
    }

    const reviews = product.reviews
    res.status(200).json({reviews})
})

// Delete a review
const DeleteReview = asyncHandler(async (req, res) => {
    const {productId} = req.params
    const {ratingId} = req.body
    const product = await Product.findOne({productId})
    if(!product){
        res.status(400)
        throw new Error('Product not found')
    }

    const reviewIndex = product.reviews.findIndex(r => r._id.toString() === ratingId);
    if (reviewIndex === -1) {
        res.status(404);
        throw new Error('Review Not Found');
    }

    product.reviews.splice(reviewIndex, 1)

    product.numReviews = product.reviews.length

    const totalRating = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    product.rating = product.numReviews > 0 ? totalRating / product.numReviews : 0;

    await product.save()

    res.status(200).json({ message: "Review Deleted Successfully"})
})

module.exports = {
    AddReview,
    GetAllReviews,
    DeleteReview
}