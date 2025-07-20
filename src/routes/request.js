const express = require("express");
const router = express.Router();
const requestRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuthentication,
  async (req, res) => {
    try {
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status))
        res
          .status(400)
          .send({ success: false, error: "Invalid status type " + status });
      const toUser = await User.findById(toUserId);
      if (!toUser)
        res.status(404).json({ success: false, error: "user not found" });
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnectionRequest)
        res
          .status(400)
          .send({ success: false, error: "Connection request already exists" });
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.send({
        success: true,
        message:
          status == "interested"
            ? "connection request send to " + toUser.firstName
            : "connection request ignored for " + toUser.firstName,
        // req.user.firstName+" "+status+" in "+toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send({ success: false, error: err.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuthentication,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status))
        return res
          .status(400)
          .send({ success: false, error: "status not allowed" });
      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest)
        return res
          .status(404)
          .json({ success: false, error: "Connection request not found" });
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      return res.send({
        success: true,
        message: "Connection request " + status,
        data: data,
      });
    } catch (err) {
      return res.status(400).send({ success: false, error: err.message });
    }
  }
);
module.exports = {
  requestRouter,
};
