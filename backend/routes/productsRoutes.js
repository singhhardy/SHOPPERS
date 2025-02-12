const express = require('express')
const router = express.Router()
const { getAllProducts, AddNewProduct } = require('../controllers/productsController')

router.route('/list').get(getAllProducts)
router.route('/add-new').post(AddNewProduct)

module.exports = router