const socket = require("socket.io");
const crypto = require("crypto");
const User = require("../models/user");
const { Chat } = require("../models/chat");
const { default: mongoose } = require("mongoose");
let UserId,firstNames;
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};
const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });
  io.on("connection", (socket) => {
       const onlineUsers = new Map();
    //handle events=>when client send the request to connection it connects for communication here
    socket.on("joinChat", async ({ firstName, userId, targetUserId }) => {
      firstNames = firstName;
      const roomId = getSecretRoomId(userId, targetUserId);
      UserId = userId;
      console.log(firstName + " joined Room " + roomId);
      socket.join(roomId);
      if (mongoose.Types.ObjectId.isValid(userId)) {
        await User.findByIdAndUpdate(userId, { isOnline: true });
      }
      onlineUsers.set(userId, socket.id);
    });
    socket.on(
      "sendMessage",
      async ({ firstName, userId, targetUserId, text, file, currentTime }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);

          //  TODO: check if userId & targetUserID both are friends
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }
          chat.messages.push({
            senderId: userId,
            text,
            file: {
              url: file?.url,
              type: file?.type,
            },
            createdAt: currentTime,
          });
          await chat.save();
          io.to(roomId).emit("messageReceived", {
            firstName,
            text,
            file,
            currentTime,
          });
        } catch (err) {
          console.error("Error in sending message: ", err);
        }
      }
    );
    socket.on("disconnect", async (reason) => {
      console.log(`User ${UserId} ${firstNames} disconnected. Reason: ${reason}`);

      try {
        const disconnectedUserId = [...onlineUsers.entries()].find(
          ([, id]) => id === socket.id
        )?.[0];
        console.log(`Disconnected User ID: ${disconnectedUserId} ${firstNames}`);
        
        if (disconnectedUserId) {
          await User.findByIdAndUpdate(disconnectedUserId, {
            isOnline: false,
            lastSeen: new Date(),
          });
          onlineUsers.delete(disconnectedUserId);

        }
      } catch (err) {
        console.error("Error updating lastSeen:", err);
      }
    });
  });
};
module.exports = initializeSocket;
