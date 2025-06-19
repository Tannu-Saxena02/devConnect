var jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuthentication = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) res.status(404).send("Please login");
    const decodeMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodeMessage;
    const user = await User.findById(_id);
    if (!user) res.status(400).send("User does not exist");
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send("Unauthorized " + err.message);
  }
};
module.exports = {
  userAuthentication,
};
