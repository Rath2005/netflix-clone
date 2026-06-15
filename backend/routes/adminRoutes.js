const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  promoteToAdmin,
  getDashboardStats,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

// All admin routes require auth + admin role
router.use(protect, admin);

// @route  GET /api/admin/stats
router.get("/stats", getDashboardStats);

// @route  GET /api/admin/users
router.get("/users", getAllUsers);

// @route  DELETE /api/admin/users/:id
router.delete("/users/:id", deleteUser);

// @route  PUT /api/admin/users/:id/promote
router.put("/users/:id/promote", promoteToAdmin);

module.exports = router;
