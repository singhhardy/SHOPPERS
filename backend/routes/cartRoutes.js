const express = require('express')
const router = express.Router()
const { AddToCart, RemoveFromCart, UpdateCart, GetCartItems, GetCartTotal, ClearCart } = require('../controllers/cartController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, AddToCart)
router.route('/').delete(protect, RemoveFromCart)
router.route('/').put(protect, UpdateCart)
router.route('/').get(protect, GetCartItems)
router.route('/total').get(protect, GetCartTotal)
router.route('/clear').delete(protect, ClearCart)

module.exports = router