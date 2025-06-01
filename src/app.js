const express = require("express");
const app = express();
const { connectDB } = require("./config/database.js");
const User = require("./models/user");
const user = require("./models/user");
const { validateSignUpData } = require("./utils/validation.js");
const bcrypt = require("bcrypt");
var cookieParser = require("cookie-parser");
const { userAuthentication } = require("./middlewares/auth.js");
app.use(express.json()); // to parse JSON bodies request
app.use(cookieParser()); // to parse cookies
var jwt = require("jsonwebtoken");

app.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req); //validate the user data
    const {  //encrypt the password
      firstName,
      lastName,
      emailId,
      password,
      age,
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
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) res.send("Invalid credentials");  //deencrypt the password
    const isPasswordValid = await user.validatePassword(password) //password, encrypted password
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token,{
        expires: new Date(Date.now() + 8 * 3600000) 
      });
      res.send("Login successfully");
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
app.get("/profile", userAuthentication, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Error " + err.message);
  }
});
app.post("/sendConnectionRequest",userAuthentication,(req,res)=>{
    try{
        const user=req.user;
        console.log("Connection request sent");
        res.send(user.firstName+" Connection request sent");
        
    }
    catch(err){
        res.status(400).send("Error " + err.message);
    }
})
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database cannot be established", err);
  });
