const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware');
const { GetAllUsers, UpdateAllUsers } = require('../controllers/userController')

router.route('/list').get(GetAllUsers)
router.put('/update/:id', protect, UpdateAllUsers)

module.exports = router