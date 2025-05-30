const express=require('express');
const app=express();
const {connectDB}=require('./config/database.js');
const User=require('./models/user');

app.post("/signup",async (req,res)=>{
    const user=new User({
        firstName:"unnat",
        lastName:"saxena",
        emailId:"akshaysaini02@gmail.com",
        password:"akshay@123",
        age:18,
        gender:"Male"
    })
    try{
        await user.save();
        res.send("User added successfully");
    }
    catch(err)
    {
        res.status(400).send("Error saving the user",err.message);
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
