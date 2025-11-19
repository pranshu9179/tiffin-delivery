// middlewares/auth.middleware.js
const ApiError = require("../utils/apiError");
const { verifyToken } = require("../utils/jwt");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization header missing");
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyToken(token);

    req.user = {
      id: payload.sub,
      role: payload.role,
    };

    next();
  } catch (err) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
