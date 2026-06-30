//C:\quran-similarity-app\backend\middleware\errorHandler.js
const { formatError } = require("../../utils/responseFormatter");
const AppError = require("../../utils/AppError");

module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    // Log full error server-side for debugging
    const detail = err.stack || err.message || err;
    console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} -`, detail);

    if (err.rollbackError) {
        console.error("Transaction rollback failed:", err.rollbackError.message);
    }

    // Handle operational errors (AppError)
    if (err.isOperational) {
        return res.status(err.statusCode).json(formatError(err.message, err.statusCode));
    }

    // Handle unexpected errors - never leak details to client in production
    const statusCode = err.statusCode || 500;
    const message =
        process.env.NODE_ENV === "production" && statusCode === 500
            ? "Internal Server Error"
            : err.message || "Internal Server Error";

    res.status(statusCode).json(formatError(message, statusCode));
};
