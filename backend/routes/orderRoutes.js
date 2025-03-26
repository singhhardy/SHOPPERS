const express = require('express')
const router = express.Router()
const { placeOrder, GetCustomerOrders, OrderInfoById, OrderStatus, GetMyOrders, verifyPayment } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, placeOrder)
router.route('/').get(protect, GetCustomerOrders)
router.route('/my-order').get(protect, GetMyOrders)
router.route('/verify-payment').post(protect, verifyPayment)
router.route('/:id').get(protect, OrderInfoById)
router.route('/status/:id').put(protect, OrderStatus)

module.exports = router