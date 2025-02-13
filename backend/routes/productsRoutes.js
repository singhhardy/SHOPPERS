const express = require('express')
const router = express.Router()
const { getAllProducts, AddNewProduct, deleteProduct, editProduct } = require('../controllers/productsController')

router.route('/list').get(getAllProducts)
router.route('/add-new').post(AddNewProduct)
router.route('/:id').delete(deleteProduct)
router.route('/:id').put(editProduct)

module.exports = router