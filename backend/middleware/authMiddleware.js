const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

/**
 * protect — Verifies JWT and attaches user to req.user
 * Usage: router.get("/profile", protect, controller)
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized — no token provided");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (exclude password)
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized — user not found");
    }

    if (!req.user.isActive) {
      res.status(401);
      throw new Error("Account has been deactivated");
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error("Not authorized — invalid token");
  }
});

module.exports = { protect };
