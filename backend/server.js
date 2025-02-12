const express = require('express');
const dotenv = require('dotenv');
const port = process.env.PORT || 8000
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const cors = require('cors')
const { errorHandler } = require('./middleware/errorMiddleware')
const productRoutes = require('./routes/productsRoutes')

connectDb();

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

app.use(errorHandler)
app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${port} `)
})
