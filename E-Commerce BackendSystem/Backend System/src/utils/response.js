/**
 * @desc    Standard success response
 * @param   {object} res - Express response object
 * @param   {string} message - Success message
 * @param   {object|array} data - Response data
 * @param   {number} statusCode - HTTP status code (default: 200)
 * @returns {object} Response object
 */
const successResponse = (res, message, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

/**
 * @desc    Error response
 * @param   {object} res - Express response object
 * @param   {string} message - Error message
 * @param   {number} statusCode - HTTP status code (default: 500)
 * @returns {object} Response object
 */
const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      statusCode,
      message
    }
  });
};

/**
 * @desc    Validation error response
 * @param   {object} res - Express response object
 * @param   {array} errors - Array of validation errors
 * @returns {object} Response object
 */
const validationErrorResponse = (res, errors) => {
  return res.status(422).json({
    success: false,
    error: {
      statusCode: 422,
      message: 'Validation failed',
      errors
    }
  });
};

/**
 * @desc    Paginated response
 * @param   {object} res - Express response object
 * @param   {string} message - Success message
 * @param   {object} paginatedResult - Mongoose paginated result
 * @param   {number} statusCode - HTTP status code (default: 200)
 * @returns {object} Response object
 */
const paginatedResponse = (res, message, paginatedResult, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data: paginatedResult,
    message
  });
};

module.exports = {
  successResponse,
  errorResponse,
  validationErrorResponse,
  paginatedResponse
}; 