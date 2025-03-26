const express = require('express');
const dotenv = require('dotenv');
const port = process.env.PORT || 8000
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const { errorHandler } = require('./middleware/errorMiddleware')
const productRoutes = require('./routes/productsRoutes')
const cartRoutes = require('./routes/cartRoutes')
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')
const reviewRoutes = require('./routes/reviewRoutes')

const app = express();

// SECURITY
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

// app.use(helmet());
app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "https://checkout.razorpay.com"],
        scriptSrc: ["'self'", "https://checkout.razorpay.com", "'unsafe-inline'", "'unsafe-eval'"],
        frameSrc: ["'self'", "https://checkout.razorpay.com"],
        connectSrc: ["'self'", "https://api.razorpay.com", "https://checkout.razorpay.com"],
        imgSrc: ["'self'", "data:", "https://*.razorpay.com"],
      }
    }
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,  
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

const corsOptions = {
    origin: ['http://localhost:4200', 'https://checkout.razorpay.com', 'https://api.razorpay.com'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
  };
  
app.use(cors(corsOptions));
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// ---------------------------

connectDb();

dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/users', userRoutes)
app.use('/api/order', orderRoutes)
app.use('/api/product/reviews', reviewRoutes)

app.use(errorHandler)
app.listen(port, () => {    
    console.log(`Server running in ${process.env.NODE_ENV} on port ${port} `)
})
