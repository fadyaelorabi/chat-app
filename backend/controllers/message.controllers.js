const asyncWrapper = require("../middlewares/asyncWrapper.js");
const httpStatusText = require("../utils/httpsStatusText.js");
const Chat = require("../models/Chat.js");
const User = require("../models/User.js");
const Message = require("../models/Message.js");

// @description     Send a new message
// @route           POST /api/Message
// @access          Protected
const sendMessage = asyncWrapper(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return res.status(400).json({
      status: httpStatusText.FAILED,
      data: { message: "Please fill all the fields" },
    });
  }

  // create the message in Message collection
  let newMessage = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  // populate sender and chat info
  newMessage = await newMessage.populate("sender", "name pic email");
  newMessage = await newMessage.populate("chat");
  newMessage = await User.populate(newMessage, {
    path: "chat.users",
    select: "name pic email",
  });

  // update latestMessage in chat
  await Chat.findByIdAndUpdate(chatId, { latestMessage: newMessage });

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: newMessage,
  });
});

// @description     Get all messages in a specific chat
// @route           GET /api/Message/:chatId
// @access          Protected
const getAllMessages = asyncWrapper(async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name pic email")
    .populate("chat");

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: messages,
  });
});

module.exports = {
  sendMessage,
  getAllMessages,
};
