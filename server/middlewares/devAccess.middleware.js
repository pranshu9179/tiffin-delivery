const ApiError = require("../utils/apiError");

module.exports = function devAccess(req, res, next) {
  // Production me ye middleware skip ho jayega
  if (process.env.NODE_ENV === "production") return next();

  const devId = req.headers["x-dev-access"];

  if (!devId) {
    return next(
      new ApiError(403, "Developer access denied. Missing x-dev-access header.")
    );
  }

  if (devId !== process.env.DEV_ID) {
    return next(new ApiError(403, "Invalid developer access token"));
  }

  next();
};
