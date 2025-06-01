const express=require("express");
const router=express.Router();
const profileRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth.js");

profileRouter.get("/profile", userAuthentication, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = {
    profileRouter
};