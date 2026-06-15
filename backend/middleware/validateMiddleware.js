const { validationResult } = require("express-validator");

/**
 * validate — Reads express-validator results and returns 400 if errors found.
 * Usage: Place after express-validator chain rules in a route definition.
 *
 * Example:
 *   router.post("/register",
 *     [body("email").isEmail(), body("password").isLength({ min: 6 })],
 *     validate,
 *     authController.register
 *   );
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = { validate };
