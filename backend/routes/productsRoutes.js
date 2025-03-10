const express = require('express')
const router = express.Router()
const { getAllProducts, AddNewProduct, deleteProduct, editProduct, getProduct } = require('../controllers/productsController')
const { protect } = require('../middleware/authMiddleware')

router.route('/list').get(getAllProducts)
router.route('/add-new').post(protect, AddNewProduct)
router.route('/:id').get(getProduct)
router.route('/:id').delete(protect, deleteProduct)
router.route('/:id').put(protect, editProduct)

module.exports = router