const express = require('express');
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require('../controllers/reviewsController');
const Review = require('../models/reviewModel');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/authMiddleware');
const advancedResults = require('../middleware/advancedResultMiddleware');

router
  .route('/')
  .get(
    advancedResults(Review, {
      path: 'bootcamp',
      select: 'name description',
    }),
    getReviews
  )
  .post(protect, authorize('user', 'admin'), addReview);
router
  .route('/:id')
  .get(getReview)
  .put(protect, authorize('user', 'admin'), updateReview)
  .delete(protect, authorize('user', 'admin'), deleteReview);
module.exports = router;
