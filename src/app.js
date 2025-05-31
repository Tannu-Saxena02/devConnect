const express=require('express');
const app=express();
const {connectDB}=require('./config/database.js');
const User=require('./models/user');
const user = require('./models/user');
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
        res.status(400).send("Error saving the user"+err.message);
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
// get user by id -homework
app.get("/userId",async(req,res)=>{
    const userId=req.body.id;
    try{
       const users= await User.findOne({_id:userId});
       if(!users)
            res.status(404).send("User not found");
        else
            res.send(users);
    }
    catch(err){
        res.status(400).send("Something went wrong");
    }
})
// delete the user from the database
app.delete("/user",async(req,res)=>{
    const userId=req.body.id;
    try{
        //  await User.findByIdAndDelete(userId);
         await User.findByIdAndDelete({_id:userId});
         res.send("User deleted successfully");
    }
    catch(err)
    {
        res.status(400).send("Something went wrong");
    }
  

})
//update the data of the user
app.patch("/user:/userId", async (req, res) => {
  const userId = req.params?.id;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdatesAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdatesAllowed) {
      throw new Error("updates are not allowed");
    }
    if(data?.skills.length>10)
        throw new Error("skills should be less than 10");
    const userData = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(userData);

    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("Something went wrongg" + err.message);
  }
});
//-API update the user by emailID.
app.patch("/userEmail",async(req,res)=>{
    const userEmail=req.body.emailId;
    const data=req.body;
    try{
        const userData= await User.findOneAndUpdate({emailId:userEmail},data);
        console.log(userData);
        res.send("User updated successfully");    
    }
   catch(err){
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
