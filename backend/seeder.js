const mongoose = require('mongoose')
const Product = require('./models/productModel')
const fs = require('fs')
const dotenv = require('dotenv');
const connectDb = require('./config/db')
const path = require('path')

dotenv.config({ path: path.join(__dirname, '../.env') });
connectDb()

const products = JSON.parse(fs.readFileSync('./data/products.json', 'utf8'))
console.log('MONGO_URI:', process.env.MONGO_URI);

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