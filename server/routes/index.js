// routes/index.js
const express = require("express");
const authRoutes = require("./auth.routes");
const protectedRoutes = require("./protected.routes");
const adminRoutes = require("./admin.routes"); // Add this

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/user", protectedRoutes);
router.use("/admin", adminRoutes); // Add this line

module.exports = router;
