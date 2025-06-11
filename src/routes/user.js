const express=require("express");
const ConnectionRequest = require("../models/connectionRequest");
const { userAuthentication } = require("../middlewares/auth");
const userRouter=express.Router();
const USER_SAFE_DATA=  "firstName lastName photoUrl age gender about skills"
// get all the pending request for the loggedin user
userRouter.get("/user/requests/received",userAuthentication,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate(
            "fromUserId",
          USER_SAFE_DATA
        )  
        res.json({message:"Data fetched successfully",
            data:connectionRequest
        })
    }
    catch(err)
    {
        res.status(400).send("ERROR",err.message);
    }
})
userRouter.get("/user/connections",userAuthentication,async(req,res)=>{
    try{
        const loggedInUser=req.user;
        const connectionRequest=await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id,status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"},
            ]
        })
        .populate("fromUserId",USER_SAFE_DATA)
        .populate("toUserId",USER_SAFE_DATA)
        const data=connectionRequest.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString())
            {
                return row.toUserId;
            }
            return row.fromUserId;
        })
        res.json({data});
    }
    catch(err)
    {
        res.status(400).send({message:err.message});
    }
})
module.exports={
    userRouter
}
