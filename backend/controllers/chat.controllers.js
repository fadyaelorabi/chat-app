const asyncWrapper = require("../middlewares/asyncWrapper.js");
const httpStatusText = require("../utils/httpsStatusText.js");
const Chat = require("../models/Chat.js");
const User = require("../models/User.js");

const accessChat = asyncWrapper(async (req, res) => {
  const { userId } = req.body; //form middleware

  if (!userId) {
    return res.status(400).json({
      status: httpStatusText.FAILED,
      data: { message: "User ID is required" },
    });
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    return res
      .status(200)
      .json({ status: httpStatusText.SUCCESS, data: isChat[0] });
  }

  // create chat if not exists
  const chatData = {
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  };

  const createdChat = await Chat.create(chatData);
  const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
    "users",
    "-password"
  );

  return res
    .status(200)
    .json({ status: httpStatusText.SUCCESS, data: FullChat });
});

const fetchChats = asyncWrapper(async (req, res) => {
  let results = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  results = await User.populate(results, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  res.status(200).json({
    status: "success",
    data: results,
    count: results.length,
  });
});

//req users and name of grp
const createGroupChat = asyncWrapper(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({
      status: httpStatusText.FAILED,
      data: { message: "Please fill all the fields" },
    });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).json({
      status: httpStatusText.FAILED,
      data: { message: "More than 2 users are required to form a group chat" },
    });
  }
  users.push(req.user);

  const groupChat = await Chat.create({
    chatName: req.body.name,
    users: users,
    isGroupChat: true,
    groupAdmin: req.user,
  });
  const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: fullGroupChat,
  });
});

const renameGroup = asyncWrapper(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName: chatName },
    { new: true } //RET UPDATED VALUE OF IT
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    return res.status(404).json({
      status: httpStatusText.FAILED,
      data: { message: "Chat Not Found" },
    });
  } else {
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: updatedChat,
    });
  }
});

const addToGroup = asyncWrapper(async (req, res) => {
  const { chatId, userId } = req.body;
  const added = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!added) {
    return res.status(404).json({
      status: httpStatusText.FAILED,
      data: { message: "Chat Not Found" },
    });
  } else {
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: added,
    });
  }
});

const removeFromGroup = asyncWrapper(async (req, res) => {
  const { chatId, userId } = req.body;
  const removed = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!removed) {
    return res.status(404).json({
      status: httpStatusText.FAILED,
      data: { message: "Chat Not Found" },
    });
  } else {
    res.status(200).json({
      status: httpStatusText.SUCCESS,
      data: removed,
    });
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
    removeFromGroup,
};
