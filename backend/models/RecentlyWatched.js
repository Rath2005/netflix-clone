const mongoose = require("mongoose");

const recentlyWatchedSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    contentId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    contentType: {
      type: String,
      enum: ["movie", "tvshow"],
      required: true,
    },
    watchedAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0, // Percentage watched (0-100)
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index so we can quickly find by user and prevent duplicate entries
recentlyWatchedSchema.index({ user: 1, contentId: 1, contentType: 1 }, { unique: true });

const RecentlyWatched = mongoose.model("RecentlyWatched", recentlyWatchedSchema);
module.exports = RecentlyWatched;
