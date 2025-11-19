const ApiError = require("../utils/apiError");

module.exports = function originBlock(req, res, next) {
  if (process.env.NODE_ENV !== "production") {
    return next(); // dev mode allows everything
  }

  const origin = req.headers.origin;
  const allowed = process.env.FRONTEND_URL;

  if (!origin || origin !== allowed) {
    return next(new ApiError(403, "API access denied: Invalid origin"));
  }

  next();
};
