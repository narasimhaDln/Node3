/**
 * Error handling middleware
 */
const { errorResponse } = require('../utils/response');

// Not found middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  return errorResponse(
    res,
    err.message,
    statusCode
  );
};

module.exports = { notFound, errorHandler };