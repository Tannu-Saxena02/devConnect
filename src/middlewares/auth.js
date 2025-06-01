var jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuthentication = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) throw new Error("Invalid token");
    const decodeMessage = await jwt.verify(token, "DevTinder@1234$");
    const { _id } = decodeMessage;
    const user = await User.findById(_id);
    if (!user) throw new Error("User does not exist");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Unauthorized " + err.message);
  }
};
module.exports = {
  userAuthentication,
};
