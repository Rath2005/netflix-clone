const asyncHandler = require("express-async-handler");
const RecentlyWatched = require("../models/RecentlyWatched");

// ─── @route   GET /api/recently-watched ──────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const getRecentlyWatched = asyncHandler(async (req, res) => {
  const history = await RecentlyWatched.find({ user: req.user._id })
    .sort("-watchedAt")
    .limit(20);

  res.status(200).json({
    success: true,
    count: history.length,
    data: history,
  });
});

// ─── @route   POST /api/recently-watched ─────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const addRecentlyWatched = asyncHandler(async (req, res) => {
  const { contentId, contentType, progress } = req.body;

  if (!contentId || !contentType) {
    res.status(400);
    throw new Error("contentId and contentType are required");
  }

  // Upsert — update if exists, create if not
  const entry = await RecentlyWatched.findOneAndUpdate(
    { user: req.user._id, contentId, contentType },
    { watchedAt: Date.now(), progress: progress || 0 },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    message: "Watch history updated",
    data: entry,
  });
});

// ─── @route   DELETE /api/recently-watched ───────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const clearHistory = asyncHandler(async (req, res) => {
  await RecentlyWatched.deleteMany({ user: req.user._id });

  res.status(200).json({
    success: true,
    message: "Watch history cleared",
  });
});

// ─── @route   DELETE /api/recently-watched/:id ───────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const removeFromHistory = asyncHandler(async (req, res) => {
  const entry = await RecentlyWatched.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!entry) {
    res.status(404);
    throw new Error("Entry not found");
  }

  res.status(200).json({
    success: true,
    message: "Entry removed from history",
  });
});

module.exports = {
  getRecentlyWatched,
  addRecentlyWatched,
  clearHistory,
  removeFromHistory,
};
