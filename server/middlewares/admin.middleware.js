// middlewares/admin.middleware.js
const ApiError = require("../utils/apiError");

module.exports = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      throw new ApiError(403, "Access denied. Admin role required.");
    }
    next();
  } catch (err) {
    next(err);
  }
};
