const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (authentication middleware)
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: "No token provided",
  });
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: not authorized",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorize,
};