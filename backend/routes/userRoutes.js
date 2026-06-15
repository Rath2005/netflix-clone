const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

// All user routes require authentication
router.use(protect);

// @route  GET  /api/users/profile
// @route  PUT  /api/users/profile
router.route("/profile").get(getProfile).put(updateProfile);

// @route  PUT  /api/users/change-password
router.put("/change-password", changePassword);

// @route  DELETE /api/users/delete
router.delete("/delete", deleteAccount);

module.exports = router;
