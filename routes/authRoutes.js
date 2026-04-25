const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/authController");

// Path: /api/auth/signup
router.post("/signup", signup);

// Optional: Add a placeholder for login later
// router.post("/login", login);
module.exports = router;