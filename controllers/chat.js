const Users = require("../models/users");
const Messages = require("../models/messages");
const io = require('../socket');

exports.getMainPage = async (req, res, next) => {
  let currentUser = await Users.findById(req.user._id);
  if (!currentUser) {
    currentUser = req.user;
  }

  const allMessages = await Messages.find();
  const users = await Users.find();
  res.render('main', {
    title: 'Realtime Chat',
    messages: allMessages,
    users: users,
    currentUser,
    currentUserId: currentUser._id.toString()
  });
};


exports.getUser = async (req, res, next) => {
  const userId = req.body.userId;
  console.log("UserId", userId)
  if (!userId) {
    return res.status(400).send({
      ok: false,
      message: "UserId does not exist"
    })
  }

  const user = await Users.findById(userId);
  if (!user) {
    return res.status(400).send({
      ok: false,
      message: "User does not exist"
    })
  }
  res.status(200).json({
    ok: true,
    user: user
  })
};


