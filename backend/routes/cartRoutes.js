const express = require('express')
const router = express.Router()
const { AddToCart, RemoveFromCart, UpdateCart, GetCartItems, GetCartTotal, ClearCart } = require('../controllers/cartController')
const { protect } = require('../middleware/authMiddleware')

router.route('/').post(protect, AddToCart)
router.route('/').put(protect, UpdateCart)
router.route('/').get(protect, GetCartItems)
router.route('/total').get(protect, GetCartTotal)
router.route('/clear').delete(protect, ClearCart)
router.route('/:id').delete(protect, RemoveFromCart)

module.exports = router