const express = require("express");
const router = express.Router();
const profileRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth.js");
const { vallidateProfileData } = require("../utils/validation.js");
profileRouter.get("/profile/view", userAuthentication, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuthentication, async (req, res) => {
  try {
    //patch-validation for each field
    if (!vallidateProfileData(req)) {
      throw new Error("updates are not allowed");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    Object.keys(req.body).forEach((key) => {
           loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();
    res.json({
      message: "Profile updated successfully",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});

module.exports = {
    profileRouter
};