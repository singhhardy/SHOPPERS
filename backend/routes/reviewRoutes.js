const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const { AddReview, GetAllReviews, DeleteReview } = require('../controllers/reviewController')
const roleMiddleware = require('../middleware/roleMiddleware')

router.route('/add/:id').post(protect, AddReview)
router.route('/:id').get(GetAllReviews)
router.route('/remove/:id').delete(protect, roleMiddleware(["admin", "SuperAdmin"]), DeleteReview)

module.exports = router