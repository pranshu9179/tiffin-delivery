const logger = require("../config/logger");
const ApiError = require("../utils/apiError");

module.exports = (err, req, res, next) => {
  const correlationId = req.correlationId || "no-id";

  if (err instanceof ApiError) {
    logger.warn("API Error", {
      correlationId,
      status: err.statusCode,
      message: err.message,
      details: err.details,
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
      correlationId,
    });
  }

  logger.error("Unhandled Error", {
    correlationId,
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    correlationId,
  });
};
