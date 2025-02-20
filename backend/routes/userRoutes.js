const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware');
const { GetAllUsers, DeleteUserById, GetUserProfile, EditUserProfile } = require('../controllers/userController')

router.route('/list').get(protect, GetAllUsers)
router.route('/:id').delete(protect, DeleteUserById)
router.route('/:id').get(protect, GetUserProfile)
router.route('/:id').put(protect, EditUserProfile)

module.exports = router