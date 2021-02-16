const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const geocode = require('../utils/geocoder');
const Bootcamp = require('../models/bootcampModel');
//@desc Get all bootcamps
//@route GET /api/v1/bootcamps
//@access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //copy request.query
  const reqQuery = { ...req.query };

  // fields to exclude
  const removeFields = ['select', 'sort'];

  //loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);

  console.log(reqQuery);
  //create query string
  let queryStr = JSON.stringify(reqQuery);

  //create operators ($gt ,$gte,etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //Finding resource
  query = Bootcamp.find(JSON.parse(queryStr));

  //select Fields
  if (req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    console.log(fields);
    query = query.select(fields);
  }

  //sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  //executing query
  const bootcamps = await query;

  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});
//@desc Get single bootcamp
//@route GET /api/v1/bootcamps/:id
//@access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc Create new bootcamp
//@route POST /api/v1/bootcamps
//@access Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp,
  });
});

//@desc Update  bootcamp
//@route PUT /api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});

//@desc Delete  bootcamp
//@route DELETE /api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: 'bootcampRemoved' });
});
//@desc Get  bootcamp within a radius
//@route GET /api/v1/bootcamps/radius/:zipcode/:distance
//@access Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  //get lat/lng from geocoder
  const loc = await geocode.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //cal radius using radians
  //divide dist by radius of Earth
  //earth Radius =3,963mi / 6,378

  const radius = distance / 3963;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
