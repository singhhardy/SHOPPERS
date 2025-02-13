const express = require('express')
const router = express.Router()
const { AddToCart } = require('../controllers/cartController')

router.route('/:id').post(AddToCart)

module.exports = router