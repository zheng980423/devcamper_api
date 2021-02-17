const express = require('express');
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/coursesController');
const Course = require('../models/courseModel');
const advancedResults = require('../middleware/advancedResultMiddleware');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/authMiddleware');
router
  .route('/')
  .get(
    advancedResults(Course, {
      path: 'bootcamp',
      select: 'name description',
    })
  )
  .get(getCourses)
  .post(protect, addCourse);
router
  .route('/:id')
  .get(getCourse)
  .put(protect, updateCourse)
  .delete(protect, deleteCourse);
module.exports = router;
