const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
//@desc Registr user
//@route GET /api/v1/auth/register
//@access public
exports.register = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true });
});
