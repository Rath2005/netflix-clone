const asyncHandler = require("express-async-handler");
const { body } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// ─── Validation Rules ─────────────────────────────────────────────────────────
const registerValidation = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required"),
];

// ─── @route   POST /api/auth/register ────────────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Create user (password hashed by pre-save hook)
  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    message: "Account created successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    },
  });
});

// ─── @route   POST /api/auth/login ───────────────────────────────────────────
// ─── @access  Public ──────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Include password for comparison (it's excluded by default via select: false)
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(401);
    throw new Error("Your account has been deactivated. Contact support.");
  }

  res.status(200).json({
    success: true,
    message: "Login successful",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    },
  });
});

// ─── @route   GET /api/auth/me ────────────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// ─── @route   POST /api/auth/logout ──────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const logout = asyncHandler(async (req, res) => {
  // JWT is stateless — client deletes token. This endpoint is a clean signal.
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = {
  register,
  login,
  getMe,
  logout,
  registerValidation,
  loginValidation,
};
