const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  allUsers,
} = require("../controllers/user.controllers.js");
const authMiddleware = require("../middlewares/auth.middleware.js");

// Register new user
router.route("/").post(signup).get(authMiddleware, allUsers);
// Authenticate user
router.post("/login", login);

module.exports = router;
