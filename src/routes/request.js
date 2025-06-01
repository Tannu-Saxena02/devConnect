const express=require("express");
const router=express.Router();
const requestRouter=express.Router();
const { userAuthentication } = require("../middlewares/auth.js");

requestRouter.post("/sendConnectionRequest",userAuthentication,(req,res)=>{
    try{
        const user=req.user;
        console.log("Connection request sent");
        res.send(user.firstName+" Connection request sent");
        
    }
    catch(err){
        res.status(400).send("Error " + err.message);
    }
})
module.exports={
    requestRouter
}