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
    res.send({
      success: true,
      message: "profile view successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
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
      success: true,
      message: "Profile updated successfully",
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

profileRouter.post("/resetpassword", userAuthentication, async (req, res) => {
  try {
    //password,new password
    const { password, newPassword } = req.body;
    const passwordHash = req.user?.password;
    if (!passwordHash) {
      return res.status(400).json({
        success: false,
        error:
          "This account uses Google Sign-In. Reset password is not applicable.",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, passwordHash);
    if (!isPasswordValid) {
      res
        .status(400)
        .send({ success: false, error: "Invalid Existing password" });
    }
    if (!validator.isStrongPassword(newPassword)) {
      res
        .status(400)
        .send({ success: false, error: "new Password is not strong enough" });
    }
    if (password === newPassword)
      res.status(400).send({
        success: false,
        error: "New password must be different from current password.",
      });
    const updatedPasswordHash = await bcrypt.hash(newPassword, 10);
    req.user.password = updatedPasswordHash;
    await req.user.save();
    res.send({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});
profileRouter.post("/forgot-password", async (req, res) => {
  const { email, newpassword } = req.body;
  const user = await User.findOne({ emailId: email });
  console.log(user);

  const passwordHash = user?.password;
  console.log(passwordHash + " " + newpassword);

  if (!user)
    return res
      .status(400)
      .send({ success: false, error: "User does not exists" });
  if (!passwordHash) {
    return res.status(400).json({
      success: false,
      error:
        "This account uses Google Sign-In. forgot password is not applicable.",
    });
  }
  const isPasswordValid = await bcrypt.compare(newpassword, passwordHash);
  if (isPasswordValid) {
    return res.status(400).send({
      success: false,
      error: "Suggest a new password, current password is same as new password",
    });
  }
  if (!validator.isStrongPassword(newpassword)) {
    res
      .status(400)
      .send({ success: false, error: "new Password is not strong enough" });
  }
  const hashedPassword = await bcrypt.hash(newpassword, 10);
  user.password = hashedPassword;
  await user.save();

  res.send({ success: true, message: "Password reset successfully" });
});
module.exports = {
  profileRouter,
};
