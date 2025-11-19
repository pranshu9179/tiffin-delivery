const logger = require("../config/logger");

module.exports = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info("API Request", {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start + "ms",
      correlationId: req.correlationId,
      user: req.user?.id || "guest",
    });
  });
  next();
};
