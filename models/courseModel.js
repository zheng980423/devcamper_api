const mongoose = require('mongoose');
const bootcampModel = require('./bootcampModel');
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a course title'],
  },
  description: {
    type: String,
    require: [true, 'Please add a description'],
  },
  weeks: {
    type: String,
    require: [true, 'Please add number of weeks'],
  },
  tuition: {
    type: Number,
    require: [true, 'Please add a tuition cost'],
  },
  minimunSkill: {
    type: String,
    require: [true, 'Please add a minimum skill'],
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  scholorshipAvaliable: {
    type: Boolean,
    default: false,
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

//static method to get average of course tuition
courseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageCost: { $avg: '$tuition' },
      },
    },
  ]);
  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

//call getaverageCost after save
courseSchema.post('save', function () {
  this.constructor.getAverageCost(this.bootcamp);
});

//call getaverageCost before remove
courseSchema.pre('remove', function () {
  this.constructor.getAverageCost(this.bootcamp);
});
module.exports = mongoose.model('Course', courseSchema);
