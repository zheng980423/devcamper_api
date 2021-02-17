const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require('../controllers/bootcampsController');
const advancedResults = require('../middleware/advancedResultMiddleware');
const Bootcamp = require('../models/bootcampModel');

//Include other resource router
const courseRouter = require('./coursesRoutes');

const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

//re-route into other resource routers
router.use('/:bootcampId/courses', courseRouter);

router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);

router.route('/:id/photo').put(protect, bootcampPhotoUpload);

router
  .route('/')
  .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
  .post(protect, createBootcamp);
router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(protect, deleteBootcamp);

module.exports = router;
