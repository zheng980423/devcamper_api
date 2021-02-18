const express = require('express');
const { getReviews, getReview } = require('../controllers/reviewsController');
const Review = require('../models/reviewModel');

const router = express.Router({ mergeParams: true });

const { protect, authorize } = require('../middleware/authMiddleware');
const advancedResults = require('../middleware/advancedResultMiddleware');

router.route('/').get(
  advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description',
  }),
  getReviews
);
router.route('/:id').get(getReview);
module.exports = router;
