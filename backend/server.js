const express = require('express');
const dotenv = require('dotenv');
const port = process.env.PORT || 8000
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes')
const cors = require('cors')

connectDb();

dotenv.config();

const app = express();
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
// app.use('/', (req, res) => {
//     res.json({message: 'Welcom to shoppers'})
// })

app.use('/api/auth', authRoutes)

app.listen(port, () => {
    console.log(`Server running in ${process.env.NODE_ENV} on port ${port} `)
})
