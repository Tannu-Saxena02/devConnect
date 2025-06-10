const express=require("express");
const router=express.Router();
const requestRouter=express.Router();
const { userAuthentication } = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");
requestRouter.post("/request/send/:status/:toUserId",userAuthentication,async(req,res)=>{
    try{
        const toUserId=req.params.toUserId;
        const fromUserId=req.user._id;
        const status=req.params.status;
        const allowedStatus=["ignored","interested"];
        if(!allowedStatus.includes(status)) 
            res.status(400).send("Invalid status type "+status);
        const toUser=await User.findById(toUserId);
        if(!toUser)
             res.status(404).json({message:"user not found"});
        const existingConnectionRequest=await ConnectionRequest.findOne({
            $or:[
                {fromUserId,toUserId},
                {fromUserId : toUserId,toUserId : fromUserId},
            ]
        })
        if(existingConnectionRequest)
            throw new Error("Connection request already exists");
        const  connectionRequest=new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        })
        const data=connectionRequest.save();
        res.json({
            message:req.user.firstName+" "+status+" in "+toUser.firstName,
            data
        })
        
    }
    catch(err){
        res.status(400).send("Error " + err.message);
    }
})
module.exports={
    requestRouter
}