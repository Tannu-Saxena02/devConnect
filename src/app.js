const express=require('express');
const app=express();
const {connectDB}=require('./config/database.js');
const User=require('./models/user');
app.use(express.json());// we send data in json but server is unable to read data in json format we need middleware
// this is express middleware to parse JSON bodies and convert into JavaScript objects that is added into request can get into body
app.post("/signup",async (req,res)=>{
    console.log(req.body);
    
    const user=new User(req.body)
    try{
        await user.save();
        res.send("User added successfully");
    }
    catch(err)
    {
        res.status(400).send("Error saving the user",err.message);
    }
})
//get user by email
app.get("/user",async(req,res)=>{
    const userEmail=req.body.emailId;
    try{
         const users=await User.findOne({emailId:userEmail});
         if(!users)
            res.status(404).send("User not found");
         else{
            res.send(users);
         }
    }
    catch(err)
    {
         res.status(400).send("Something went wrong");
    }
  
})
//get all users
app.get("/feed",async(req,res)=>{
    const userEmail=req.body.emailId;
    try{
         const users=await User.find({});
         res.send(users);

    }
    catch(err)
    {
         res.status(400).send("Something went wrong");
    }
  
})
connectDB().then(()=>{
    console.log("Database connection established");
    app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
}).catch((err)=>{
    console.error("Database cannot be established",err);
})
