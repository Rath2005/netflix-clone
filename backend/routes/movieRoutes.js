const express = require("express");
const router = express.Router();
const {
  getAllMovies,
  getMovie,
  getTrending,
  getRecommended,
  searchMovies,
  filterByGenre,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// ── Public Routes ─────────────────────────────────────────────────────────────
// IMPORTANT: Specific routes must come BEFORE parameterized routes (:id)
router.get("/trending", getTrending);
router.get("/recommended", getRecommended);
router.get("/search", searchMovies);
router.get("/genre/:genre", filterByGenre);

// @route  GET  /api/movies
// @route  POST /api/movies  (admin only)
router
  .route("/")
  .get(getAllMovies)
  .post(protect, admin, createMovie);

// @route  GET    /api/movies/:id
// @route  PUT    /api/movies/:id  (admin only)
// @route  DELETE /api/movies/:id  (admin only)
router
  .route("/:id")
  .get(getMovie)
  .put(protect, admin, updateMovie)
  .delete(protect, admin, deleteMovie);

module.exports = router;
