const express = require("express");
const router = express.Router();
const profileRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth.js");
const { vallidateProfileData } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const validator = require("validator");

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
    if (!vallidateProfileData(req, res)) {
      res.status(400).send("updates are not allowed");
    }
    const loggedInUser = req.user;
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

profileRouter.post("/resetpassword", userAuthentication, async (req, res) => {
  try {
    //password,new password
    const { password, newPassword } = req.body;
    const passwordHash = req.user.password;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      res.status(400).send("Invalid Existing password");
    }
    if (!validator.isStrongPassword(newPassword)) {
      res.status(400).send("new Password is not strong enough");
    }
    if (password === newPassword)
      res
        .status(400)
        .send("New password must be different from current password.");
    const updatedPasswordHash = await bcrypt.hash(newPassword, 10);
    req.user.password = updatedPasswordHash;
    await req.user.save();
    res.send("Password updated successfully");
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
profileRouter.post("/forgot-password", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ emailId: email });
  const passwordHash = user.password;

  if (!user) return res.status(400).send("User does not exists");

  const isPasswordValid = await bcrypt.compare(password, passwordHash);
  if (isPasswordValid) {
    return res
      .status(400)
      .send("Suggest a new password, current password is same as new password");
  }
  if (!validator.isStrongPassword(password)) {
    res.status(400).send("new Password is not strong enough");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  await user.save();

  res.send("Password reset successfully");
});
module.exports = {
  profileRouter,
};
