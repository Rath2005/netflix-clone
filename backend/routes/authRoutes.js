const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  registerValidation,
  loginValidation,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const { validate } = require("../middleware/validateMiddleware");

// @route  POST /api/auth/register
router.post("/register", registerValidation, validate, register);

// @route  POST /api/auth/login
router.post("/login", loginValidation, validate, login);

// @route  GET /api/auth/me
router.get("/me", protect, getMe);

// @route  POST /api/auth/logout
router.post("/logout", protect, logout);

module.exports = router;
