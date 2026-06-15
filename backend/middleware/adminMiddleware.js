/**
 * admin — Checks if the authenticated user has the "admin" role.
 * Must be used AFTER the protect middleware.
 * Usage: router.delete("/users/:id", protect, admin, controller)
 */
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Access denied — Admins only");
  }
};

module.exports = { admin };
