const express = require('express')
const router = express.Router()
const { getAllProducts, AddNewProduct, deleteProduct, editProduct, getProduct, searchProducts } = require('../controllers/productsController')
const { protect } = require('../middleware/authMiddleware')

router.route('/list').get(getAllProducts)
router.route('/add-new').post(protect, AddNewProduct)
router.route('/search').get(searchProducts)
router.route('/:id').get(getProduct)
router.route('/:id').delete(protect, deleteProduct)
router.route('/:id').put(protect, editProduct)

module.exports = router