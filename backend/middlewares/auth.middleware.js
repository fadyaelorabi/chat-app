const jwt = require("jsonwebtoken");
const { verifyJWT } = require("../utils/jwtUtils");
const User = require("../models/User");
const httpStatusText = require("../utils/httpsStatusText.js");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    const decoded = verifyJWT(token);
    if (decoded) {
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } else {
      return res.status(401).json({
        status: httpStatusText.FAILED,
        data: { message: "Unauthorized: Invalid token" },
      });
    }
  } else {
    return res.status(401).json({
      status: httpStatusText.FAILED,
      data: { message: "Unauthorized: No token provided" },
    });
  }
};

module.exports = authMiddleware;
