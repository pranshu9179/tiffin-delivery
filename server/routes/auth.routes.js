// routes/auth.routes.js
const express = require("express");
const Joi = require("joi");
const validate = require("../middlewares/validate.middleware");
const { loginLimiter } = require("../middlewares/rateLimit.middleware");
const authService = require("../services/auth.service");
const ApiError = require("../utils/apiError");

const router = express.Router();

// Validation schemas
const registerSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    role: Joi.string()
      .valid("customer", "delivery_boy", "admin")
      .default("customer"),
  }),
});

const loginSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const refreshSchema = Joi.object({
  body: Joi.object({ refreshToken: Joi.string().required() }),
});

const logoutSchema = refreshSchema;

// User Registration (all roles including admin)
router.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password, role } = req.validated.body;
    const user = await authService.register({ name, email, password, role });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
});

// Login
router.post(
  "/login",
  loginLimiter,
  validate(loginSchema),
  async (req, res, next) => {
    try {
      const { email, password } = req.validated.body;
      const result = await authService.login({ email, password, ip: req.ip });

      // Set refresh token as httpOnly cookie
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 3600 * 1000, // 7 days
      });

      res.json({
        accessToken: result.accessToken,
        user: result.user,
      });
    } catch (err) {
      next(new ApiError(401, err.message));
    }
  }
);

// Refresh Token
router.post("/refresh", validate(refreshSchema), async (req, res, next) => {
  try {
    const { refreshToken } = req.validated.body;
    const rotated = await authService.rotateRefresh({
      providedRefreshToken: refreshToken,
      ip: req.ip,
    });

    res.cookie("refreshToken", rotated.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 3600 * 1000,
    });

    res.json({ accessToken: rotated.accessToken });
  } catch (err) {
    next(new ApiError(401, err.message));
  }
});

// Logout
router.post("/logout", validate(logoutSchema), async (req, res, next) => {
  try {
    await authService.logout({
      providedRefreshToken: req.validated.body.refreshToken,
    });
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
