// backend/utils/AppError.js
// Custom error class for operational/expected errors

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Flag to distinguish from unexpected errors

    // Maintain proper stack trace (only available on V8)
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
