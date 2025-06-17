const express = require("express");
const app = express();
const { connectDB } = require("./config/database.js");
var cookieParser = require("cookie-parser");
var cors = require('cors')
const { authRouter }=require("./routes/auth.js")
const { profileRouter }=require("./routes/profile.js")
const { requestRouter }=require("./routes/request.js")
const { userRouter }=require("./routes/user.js")
app.use(cors({
  origin: 'http://localhost:5173',   // Allow frontend origin
  credentials: true                  // Allow cookies or credentials
}));
app.use(express.json()); // to parse JSON bodies request
app.use(cookieParser()); // to parse cookies


app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);


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
