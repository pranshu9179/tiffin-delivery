const ApiError = require("../utils/apiError");

module.exports = (req, res, next) => {
  const origin = req.headers.origin || null;
  const devKey = req.headers["x-dev-key"];

  // If request comes from POSTMAN (origin = null)
  const isPostman = !origin;

  if (isPostman) {
    // Developer must provide correct dev key
    if (devKey !== process.env.DEV_MODE_KEY) {
      return next(
        new ApiError(
          403,
          "Postman access denied: Missing or invalid developer key"
        )
      );
    }

    // Inject developer identity
    req.user = {
      id: process.env.DEV_ID,
      role: "developer",
    };

    req.isDeveloper = true;
  }

  next();
};
