// utils/jwtUtils.js
const jwt = require("jsonwebtoken");

const generateJWT = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyJWT = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null; // invalid or expired
  }
};

module.exports = { generateJWT, verifyJWT };
