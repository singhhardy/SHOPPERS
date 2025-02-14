const express = require('express')
const router = express.Router()
const { AddToCart, RemoveFromCart, UpdateCart, GetCartItems, GetCartTotal, ClearCart } = require('../controllers/cartController')

router.route('/').post(AddToCart)
router.route('/').delete(RemoveFromCart)
router.route('/').put(UpdateCart)
router.route('/').get(GetCartItems)
router.route('/total').get(GetCartTotal)
router.route('/clear').delete(ClearCart)

module.exports = router