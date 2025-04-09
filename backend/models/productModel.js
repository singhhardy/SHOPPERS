const mongoose = require('mongoose')

const reviewsSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        },
        rating: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

const ProductSchema = new mongoose.Schema(
    {
        // user: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     required: true,
        //     ref: 'User'
        // },
        name: {
            type: String,
        },
        image: {
            type: String,
        },
        imgs: [
            {
                type: String, 
            }
        ],
        sizes: [
            {
                type: Number,
            }
        ],
        brand: {
            type: String,
        },
        category: {
            type: String,
        },
        description: {
            type: String,
        },
        reviews: [reviewsSchema],
        rating: {
            type: Number,
            default: 0,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            default: 0
        },
        countInStock: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
) 



module.exports = mongoose.model('Product', ProductSchema)