const mongoose = require("mongoose");

const watchlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One watchlist per user
      index: true,
    },
    movies: [
      {
        movie: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Movie",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tvshows: [
      {
        tvshow: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "TVShow",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
module.exports = Watchlist;
