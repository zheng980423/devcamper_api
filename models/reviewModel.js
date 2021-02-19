const mongoose = require('mongoose');
const bootcampModel = require('./bootcampModel');
const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the review'],
    maxlength: 100,
  },
  text: {
    type: String,
    require: [true, 'Please add some text'],
  },

  rating: {
    type: Number,
    min: 1,
    max: 10,
    require: [true, 'Please add a rating between 1-10'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});
// Prevent user from submiting more than one review per bootcamp
reviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
