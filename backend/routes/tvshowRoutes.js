const express = require("express");
const router = express.Router();
const {
  getAllTVShows,
  getTVShow,
  getTrendingTVShows,
  searchTVShows,
  filterTVByGenre,
  createTVShow,
  updateTVShow,
  deleteTVShow,
} = require("../controllers/tvshowController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// ── Public Routes ─────────────────────────────────────────────────────────────
router.get("/trending", getTrendingTVShows);
router.get("/search", searchTVShows);
router.get("/genre/:genre", filterTVByGenre);

router
  .route("/")
  .get(getAllTVShows)
  .post(protect, admin, createTVShow);

router
  .route("/:id")
  .get(getTVShow)
  .put(protect, admin, updateTVShow)
  .delete(protect, admin, deleteTVShow);

module.exports = router;
