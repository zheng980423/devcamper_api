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

  //mongoose bad objectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  res.status(error.statusCode || 500).json({
    succcess: false,
    error: error.message || 'Server Error',
  });
};
module.exports = { errorHandler };
