const express = require('express')
const router = express.Router()
const { OrderDetails, GetCustomerOrders } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, OrderDetails)
router.route('/').get(protect, GetCustomerOrders)

module.exports = router