const express = require("express");
const { userAuth, userAuthentication } = require("../middlewares/auth");
const { Chat } = require("../models/chat");
const User = require("../models/user");
const multer = require('multer');
const path = require('path');

const chatRouter = express.Router();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage })

chatRouter.get("/chat/:targetUserId", userAuthentication, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  try {
    let chat = await Chat.findOne({
      participants: { $all: [userId, targetUserId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });
    if (!chat) {
      chat = new Chat({
        participants: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }
    res.json(chat);
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
chatRouter.get("/status/:userId", userAuthentication, async (req, res) => {
  try {
     const userId = req.params.userId;
    if (!userId) {
       res.status(400).send("User does not exist");
    }
      const user = await User.findById(userId).select("firstName lastName photoUrl isOnline lastSeen");
      console.log(user);
      
      res.send(user);

  } catch (err) {
    console.error(err);
   res.status(400).send("Error " + err.message);
  }
});

;

chatRouter.post('/upload', upload.single('file'), (req, res) => {
  console.log(process.env.BASE_URL+"/uploads/" +req.file.filename);
  
  res.json({
    fileUrl: process.env.BASE_URL+"/uploads/" +req.file.filename,
  });
});
module.exports = chatRouter;