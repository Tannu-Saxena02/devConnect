const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      // required:true,
    },
    file: {
      url: {
        type: String,
      },
      type: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  messages: [messageSchema],
  lastseen: {
    type: Date,
    ref: "User",
  },
});

const Chat = mongoose.model("Chat", chatSchema);
module.exports = { Chat };
