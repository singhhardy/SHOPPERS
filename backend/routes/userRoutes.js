const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware');
const { GetAllUsers, DeleteUserById, GetUserProfile, EditUserProfile, ChangePassword, AddNewAddress } = require('../controllers/userController');
const roleMiddleware = require('../middleware/roleMiddleware');

router.route('/list').get(protect, GetAllUsers)
router.route('/:id').delete(protect, roleMiddleware(["admin", "SuperAdmin"]), DeleteUserById)
router.route('/:id').get(protect, GetUserProfile)
router.route('/:id').put(protect, roleMiddleware(["admin", "SuperAdmin"]), EditUserProfile)
router.route('/change-password/:id').put(protect, ChangePassword)
router.route('/addresses').post(protect, AddNewAddress)

module.exports = router