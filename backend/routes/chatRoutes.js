const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chat.controllers.js");
const router = express.Router();

router.route("/").post(authMiddleware, accessChat); //chat creation route or fetch (1-1)
router.route("/").get(authMiddleware, fetchChats);
router.route("/group").post(authMiddleware, createGroupChat);
router.route("/rename").put(authMiddleware, renameGroup);
router.route("/groupremove").put(authMiddleware, removeFromGroup);
router.route("/groupadd").put(authMiddleware, addToGroup);

module.exports = router;
