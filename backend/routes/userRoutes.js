const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware');
const { GetAllUsers, DeleteUserById, GetUserProfile, EditUserProfile, ChangePassword, AddNewAddress, GetProfile, EditProfile, GetUserAddresses, DeleteAddress } = require('../controllers/userController');
const roleMiddleware = require('../middleware/roleMiddleware');

router.route('/list').get(protect, GetAllUsers)
router.route('/user-profile').get(protect, GetProfile)
router.route('/editprofile').put(protect, EditProfile)
router.route('/addresses').post(protect, AddNewAddress)
router.route('/user-addresses').get(protect, GetUserAddresses)
router.route('/address/:id').delete(protect, DeleteAddress)
router.route('/:id').delete(protect, roleMiddleware(["admin", "SuperAdmin"]), DeleteUserById)
router.route('/:id').get(protect, GetUserProfile)
router.route('/:id').put(protect, roleMiddleware(["admin", "SuperAdmin", "user"]), EditUserProfile)
router.route('/change-password/:id').put(protect, ChangePassword)

module.exports = router