const asyncHandler = require("express-async-handler");
const Watchlist = require("../models/Watchlist");

// ─── @route   GET /api/watchlist ──────────────────────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const getWatchlist = asyncHandler(async (req, res) => {
  let watchlist = await Watchlist.findOne({ user: req.user._id })
    .populate("movies.movie", "title thumbnail rating year genre duration")
    .populate("tvshows.tvshow", "title thumbnail rating year genre seasons");

  if (!watchlist) {
    // Auto-create an empty watchlist for the user
    watchlist = await Watchlist.create({ user: req.user._id });
  }

  res.status(200).json({
    success: true,
    data: watchlist,
  });
});

// ─── @route   POST /api/watchlist/movie/:movieId ─────────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const addMovieToWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  let watchlist = await Watchlist.findOne({ user: req.user._id });

  if (!watchlist) {
    watchlist = await Watchlist.create({ user: req.user._id });
  }

  // Check if already in watchlist
  const alreadyAdded = watchlist.movies.some(
    (m) => m.movie && m.movie.toString() === movieId
  );

  if (alreadyAdded) {
    res.status(400);
    throw new Error("Movie already in your watchlist");
  }

  watchlist.movies.push({ movie: movieId });
  await watchlist.save();

  res.status(200).json({
    success: true,
    message: "Movie added to watchlist",
    data: watchlist,
  });
});

// ─── @route   DELETE /api/watchlist/movie/:movieId ───────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const removeMovieFromWatchlist = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const watchlist = await Watchlist.findOne({ user: req.user._id });

  if (!watchlist) {
    res.status(404);
    throw new Error("Watchlist not found");
  }

  watchlist.movies = watchlist.movies.filter(
    (m) => m.movie && m.movie.toString() !== movieId
  );

  await watchlist.save();

  res.status(200).json({
    success: true,
    message: "Movie removed from watchlist",
  });
});

// ─── @route   POST /api/watchlist/tvshow/:tvshowId ───────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const addTVShowToWatchlist = asyncHandler(async (req, res) => {
  const { tvshowId } = req.params;

  let watchlist = await Watchlist.findOne({ user: req.user._id });

  if (!watchlist) {
    watchlist = await Watchlist.create({ user: req.user._id });
  }

  const alreadyAdded = watchlist.tvshows.some(
    (t) => t.tvshow && t.tvshow.toString() === tvshowId
  );

  if (alreadyAdded) {
    res.status(400);
    throw new Error("TV Show already in your watchlist");
  }

  watchlist.tvshows.push({ tvshow: tvshowId });
  await watchlist.save();

  res.status(200).json({
    success: true,
    message: "TV Show added to watchlist",
    data: watchlist,
  });
});

// ─── @route   DELETE /api/watchlist/tvshow/:tvshowId ─────────────────────────
// ─── @access  Private ─────────────────────────────────────────────────────────
const removeTVShowFromWatchlist = asyncHandler(async (req, res) => {
  const { tvshowId } = req.params;

  const watchlist = await Watchlist.findOne({ user: req.user._id });

  if (!watchlist) {
    res.status(404);
    throw new Error("Watchlist not found");
  }

  watchlist.tvshows = watchlist.tvshows.filter(
    (t) => t.tvshow && t.tvshow.toString() !== tvshowId
  );

  await watchlist.save();

  res.status(200).json({
    success: true,
    message: "TV Show removed from watchlist",
  });
});

module.exports = {
  getWatchlist,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  addTVShowToWatchlist,
  removeTVShowFromWatchlist,
};
