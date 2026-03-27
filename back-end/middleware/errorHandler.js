const AppError = require("../utils/AppError");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  if (res.headersSent) {
    return next(err);
  }

  if (!err.isOperational && statusCode === 500) {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    status,
    message: err instanceof AppError ? err.message : err.message || "Server error",
  });
};

module.exports = { errorHandler };