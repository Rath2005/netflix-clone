const express = require("express");
const router = express.Router();
const {
  getWatchlist,
  addMovieToWatchlist,
  removeMovieFromWatchlist,
  addTVShowToWatchlist,
  removeTVShowFromWatchlist,
} = require("../controllers/watchlistController");
const { protect } = require("../middleware/authMiddleware");

// All watchlist routes require authentication
router.use(protect);

// @route  GET  /api/watchlist
router.get("/", getWatchlist);

// @route  POST   /api/watchlist/movie/:movieId
// @route  DELETE /api/watchlist/movie/:movieId
router
  .route("/movie/:movieId")
  .post(addMovieToWatchlist)
  .delete(removeMovieFromWatchlist);

// @route  POST   /api/watchlist/tvshow/:tvshowId
// @route  DELETE /api/watchlist/tvshow/:tvshowId
router
  .route("/tvshow/:tvshowId")
  .post(addTVShowToWatchlist)
  .delete(removeTVShowFromWatchlist);

module.exports = router;
