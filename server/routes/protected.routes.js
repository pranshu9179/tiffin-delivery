const express = require("express");
const auth = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me", auth, (req, res) => {
  res.json({ id: req.user.id, role: req.user.role });
});

module.exports = router;
