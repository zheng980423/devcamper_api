const ErrorResponse = require('../utils/errorResponse');

// const notFound = (req, res, next) => {
//   const error = new Error(`Not found - ${req.originalUrl}`);
//   res.status(404);
//   next(error);
// };
const errorHandler = (err, req, res, next) => {
  let error = {
    ...err,
  };
  error.message = err.message;

  //log error for dev
  console.log(err);
  //mongoose bad objectId id的长度不同
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new ErrorResponse(message, 404);
  }
  //mongoose duplicate key 重复创建bootcamp
  if (err.code === 11000) {
    const message = 'duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }
  //mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ErrorResponse(message, 400);
  }
  res.status(error.statusCode || 500).json({
    succcess: false,
    error: error.message || 'Server Error',
  });
};
module.exports = { errorHandler };
