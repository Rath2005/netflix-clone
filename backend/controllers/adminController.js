const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Movie = require("../models/Movie");
const TVShow = require("../models/TVShow");

// ─── @route   GET /api/admin/users ───────────────────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const users = await User.find().sort("-createdAt").skip(skip).limit(limit);
  const total = await User.countDocuments();

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: users,
  });
});

// ─── @route   DELETE /api/admin/users/:id ────────────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot delete your own account");
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// ─── @route   PUT /api/admin/users/:id/promote ───────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const promoteToAdmin = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({
    success: true,
    message: `${user.name} has been promoted to admin`,
    data: user,
  });
});

// ─── @route   GET /api/admin/stats ───────────────────────────────────────────
// ─── @access  Admin ───────────────────────────────────────────────────────────
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalMovies, totalTVShows, recentUsers] = await Promise.all([
    User.countDocuments(),
    Movie.countDocuments(),
    TVShow.countDocuments(),
    User.find().sort("-createdAt").limit(5).select("name email role createdAt"),
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalMovies,
      totalTVShows,
      recentUsers,
    },
  });
});

module.exports = {
  getAllUsers,
  deleteUser,
  promoteToAdmin,
  getDashboardStats,
};
