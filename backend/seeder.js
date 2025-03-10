const mongoose = require('mongoose')
const Product = require('./models/productModel')
const fs = require('fs')
const dotenv = require('dotenv');
const connectDb = require('./config/db')

dotenv.config()
connectDb()

const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'))

const seedProducts = async () => {
    try{
        // await Product.deleteMany() [ optional ]
        const insertedProducts = await Product.insertMany(products)
        console.log(`Inserted ${insertedProducts.length} products successfully!`);
        await mongoose.connection.close()
        process.exit(0)
    } catch(error){
        console.log('Seeding error', error)
        await mongoose.connection.close()
        process.exit(1)
    }
}

seedProducts()