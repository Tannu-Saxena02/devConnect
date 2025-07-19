const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const User = require("../models/user");
var jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req, res); //validate the user data
    const {
      //encrypt the password
      firstName,
      lastName,
      emailId,
      password,
      age,
      about,
      gender,
      photoUrl,
      skills,
    } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
      age,
      gender,
      photoUrl,
      skills,
    });
    await user.save();
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true, // required for HTTPS
      sameSite: "None",
    });
    res.json({ success: true, message: "User added successfully", data: user });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) res.send("Invalid credentials"); //deencrypt the password
    const isPasswordValid = await user.validatePassword(password); //password, encrypted password
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
        httpOnly: true,
        secure: true, // required for HTTPS
        sameSite: "None",
      });
      res.send({ success: true, message: "Login Successful", data: user });
    } else {
      res.status(400).send({ success: false, error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true, // required for HTTPS
    sameSite: "None",
  });
  res.send({ success: true, message: "Logout successfully" });
});
authRouter.post("/google-auth", async (req, res) => {
  const { credential, client_id } = req.body;
  try {
    // Verify the ID token with Google's API
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: client_id,
    });
    const payload = ticket.getPayload();

    const { email, given_name, family_name } = payload;

    // Check if the user already exists in the database
    let user = await User.findOne({ emailId: email });
    if (!user) {
      // Create a new user if they don't exist
      user = await User.create({
        firstName: `${given_name}`,
        lastName: family_name,
        emailId: email,
        authSource: "google",
      });
    }

    // Generate a JWT token
    const token = await user.getJWT();
    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
      secure: true, // required for HTTPS
      sameSite: "None",
    });

    // Send the token as a cookie and response
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      data: user,
    });
  } catch (err) {
    console.error("Error during Google Authentication:", err);
    res
      .status(400)
      .json({ success: false, error: "Authentication failed " + err });
  }
});
module.exports = {
  authRouter,
};
