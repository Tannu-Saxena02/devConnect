const express = require('express');
const app=express();

// app.use("/route",rH,[rh2,rH3],rh4,rh5);
app.use("/user",(req,res,next)=>{
    console.log("Handling the route user");
    next();
    // res.send("Response!!") // it will not send the response to the client

},
(req,res,next)=>{
    console.log("Handling the route user2");
    // res.send("2nd Response!!")
     next();
},
[(req,res,next)=>{
    console.log("Handling the route user3");
    // res.send("3rd Response!!")
     next();
},
(req,res,next)=>{
    console.log("Handling the route user4");
    // res.send("4th Response!!")
    next();//express is expecting another route handler but it donot get but it will comment it does not give response
}],
(req,res,next)=>{
    console.log("Handling the route user5");
    res.send("5th Response!!")
}
)
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})