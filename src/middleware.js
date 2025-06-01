const express = require("express");
const app = express();
// GET /users=> it checks all the app.xxx("with the matching route") functions till it get the response back to the server
// middleware chain=>request habdler
// app.use("/route",rH,[rh2,rH3],rh4,rh5);
app.get(
  "/user",
  (req, res, next) => {
    console.log("Handling the route user");
    next();
  },
  (req, res, next) => {
    console.log("Handling the route user2");
    next();
  },
  [
    (req, res, next) => {
      console.log("Handling the route user3");
      next();
    },
    (req, res, next) => {
      console.log("Handling the route user4");
      next(); //express is expecting another route handler but it donot get but it will comment it does not give response
    },
  ],
  (req, res, next) => {
    console.log("Handling the route user5");
    res.send("5th Response!!");
  }
);
//multiple middleware and multiple route handler->middleware execte the other middleware by calling the next function it called in chain one after the another until it will get the response back to the server when it send back the response that is send by route handler
// or
// app.use("/route",rH,[rh2,rH3],rh4,rh5);
app.use("/user", (req, res, next) => {
  console.log("Handling the route user");
  next();
});
app.use("/user", (req, res, next) => {
  console.log("Handling the route user");
  // next();
  res.send("Response!!"); // it will not send the response to the client
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
