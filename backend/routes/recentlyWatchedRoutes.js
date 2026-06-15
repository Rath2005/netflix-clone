const express = require("express");
const router = express.Router();
const {
  getRecentlyWatched,
  addRecentlyWatched,
  clearHistory,
  removeFromHistory,
} = require("../controllers/recentlyWatchedController");
const { protect } = require("../middleware/authMiddleware");

// All recently-watched routes require authentication
router.use(protect);

// @route  GET    /api/recently-watched
// @route  POST   /api/recently-watched
// @route  DELETE /api/recently-watched  (clears all)
router
  .route("/")
  .get(getRecentlyWatched)
  .post(addRecentlyWatched)
  .delete(clearHistory);

// @route  DELETE /api/recently-watched/:id
router.delete("/:id", removeFromHistory);

module.exports = router;
