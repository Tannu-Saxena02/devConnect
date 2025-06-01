var jwt = require('jsonwebtoken');
const User = require("../models/user");
const adminAuth=(req,res,next)=>{
    console.log("Auth middleware for admin");
    const token="xyz";
    const isAdminAuthorized=token==="xyz"; 
    if(!isAdminAuthorized){
        return res.status(401).send("Unauthorized");
    }
    else next();   
}
const userAuth=(req,res,next)=>{
    console.log("Auth middleware for user");
    const token="xyz";
    const isAdminAuthorized=token==="xyz"; 
    if(!isAdminAuthorized){
        return res.status(401).send("Unauthorized");
    }
    else next();   
}
const userAuthentication=async(req,res,next)=>{
    try{
      const cookies=req.cookies;
      const {token}=cookies;
       if(!token)
          throw new Error("Invalid token");
        const decodeMessage= await jwt.verify(token,"DevTinder@1234$");
        const{_id}=decodeMessage;
        const user=await User.findById(_id);
        if(!user)
            throw new Error("User does not exist");
        req.user=user;
        next();
    }
    catch(err){
        res.status(400).send("Unauthorized "+err.message);
    }
      
}
module.exports={
    adminAuth,
    userAuth,
    userAuthentication};