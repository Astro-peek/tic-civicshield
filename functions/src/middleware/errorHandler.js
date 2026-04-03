const { ApiError } = require("../utils/errors");

function notFoundHandler(req, _res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(error, _req, res, _next) {
  const statusCode = error?.statusCode || 500;
  const response = {
    success: false,
    message: error?.message || "Internal server error",
  };

  if (error instanceof ApiError && error.details) {
    response.details = error.details;
  }

  if (statusCode >= 500) {
    console.error("[API_ERROR]", error);
  }

  res.status(statusCode).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler,
};
