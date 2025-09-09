// controllers/auth.controller.js
const bcrypt = require("bcryptjs");
const User = require("../models/User.js");
const { generateJWT } = require("../utils/jwtUtils.js");
const asyncWrapper = require("../middlewares/asyncWrapper.js");
const httpStatusText = require("../utils/httpsStatusText.js");
const { hashPassword, verifyPassword } = require("../utils/passwordUtils.js");

const signup = asyncWrapper(async (req, res) => {
  const { name, email, password, confirmPassword, pic } = req.body;

  console.log("req.body:", req.body);

  if (password !== confirmPassword) {
    return res.status(400).json({
      status: httpStatusText.FAILED,
      data: { message: "Passwords do not match" },
    });
  }

  const oldUser = await User.findOne({ email });
  if (oldUser) {
    return res.status(400).json({
      status: httpStatusText.FAILED,
      data: { message: "User already exists" },
    });
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
    pic,
  });

  const token = await generateJWT({
    id: newUser._id,
    email: newUser.email,
  });

  res.status(201).json({
    status: httpStatusText.SUCCESS,
    data: {
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        pic: newUser.pic,
      },
      token,
    },
  });
});

const login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      status: httpStatusText.FAILED,
      data: { message: "Email and password are required" },
    });
  }

  const user = await User.findOne({ email });
  let success = false;

  if (user) {
    const isMatch = await verifyPassword(password, user.password);
    success = isMatch;
  }

  if (!user || !success) {
    return res.status(401).json({
      status: httpStatusText.FAILED,
      data: { message: "Invalid credentials" },
    });
  }

  /*const accessToken = await generateJWT(
    { id: user._id, email: user.email },
  
  );
  const refreshToken = await generateJWT(
    { id: user._id, email: user.email },
    process.env.JWT_REFRESH_EXPIRES
  );*/

  const token = await generateJWT({ id: user._id, email: user.email });

  console.log(
    `[LOGIN] user ${user.email} logged in at ${new Date().toISOString()}`
  );

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
      token,
    },
  });
}); // GET http://localhost:5000/api/user?search=fadya
//req.query.search: grabs whatever you send after ?search=.

//If it exists, it builds a MongoDB query object using $or.
const allUsers = asyncWrapper(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } }, //case insens
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  console.log(keyword);
  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }); ///excludes the currently logged-in user
  return res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: users,
  });
});

module.exports = { signup, login, allUsers };
