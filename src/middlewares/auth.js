var jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuthentication = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) return res.status(401).send("Please login");
    const decodeMessage = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodeMessage;
    const user = await User.findById(_id);
    if (!user) return res.status(400).send("User does not exist");
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).send("Unauthorized " + err.message);
  }
};
module.exports = {
  userAuthentication,
};
