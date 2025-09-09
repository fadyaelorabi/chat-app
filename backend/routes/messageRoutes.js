const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const router = express.Router();

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected

const {
  sendMessage,
  getAllMessages,
} = require("../controllers/message.controllers.js");

router.route("/").post(authMiddleware, sendMessage);
router.route("/:chatId").get(authMiddleware, getAllMessages);

module.exports = router;
