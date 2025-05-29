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
module.exports={adminAuth,userAuth};