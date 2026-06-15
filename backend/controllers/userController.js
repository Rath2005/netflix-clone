const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// ─── @route   GET /api/users/profile ─────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// ─── @route   PUT /api/users/profile ─────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const updateProfile = asyncHandler(async (req, res) => {
  const { name, profilePic } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, profilePic },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: user,
  });
});

// ─── @route   PUT /api/users/change-password ─────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Both current and new passwords are required");
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.matchPassword(currentPassword))) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword; // Pre-save hook will hash it
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// ─── @route   DELETE /api/users/delete ───────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const deleteAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isActive: false });
  res.status(200).json({
    success: true,
    message: "Account deactivated successfully",
  });
});

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
};
