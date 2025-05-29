const express=require('express');
const app=express();
const {adminAuth,userAuth}=require('./middlewares/auth.js');

//handle auth middleware for all get,post,put,delete
app.use("/admin",adminAuth)


app.get("/user/login",(req,res,next)=>{
   res.send("User login successfully")   
})

app.get("/user/data",userAuth,(req,res,next)=>{
   res.send("User data sent")   
})

app.get("/admin/getAllData",(req,res,next)=>{
   res.send("User data sent")   
})
app.get("/admin/getAllData",(req,res,next)=>{
   res.send("User data sent")   
})
app.get("/admin/deleteUser",(req,res,next)=>{
   res.send("User data deleted")   
})
// /user,/user/
app.get("/user", (req, res) => {
    //query
    console.log(req.query);
    res.send({"firstName":"Akshay","lastName":"Kumar"});
});
app.get("/user/:userId/:name/:password", (req, res) => {
    //dynamic params
    console.log(req.params);
    res.send({"firstName":"Akshay","lastName":"Kumar"});
});
//regex start with anything but end with fly
app.get(/.*fly$/, (req, res) => {
    res.send({"firstName":"Akshay","lastName":"Kumar"});
});
// we can send b multiple times
app.get("/ab+c", (req, res) => {
    res.send({"firstName":"Akshay","lastName":"Kumar"});
});
// we can send anything between ab cd
app.get("/ab*cd", (req, res) => {
    res.send("data can passed in between successfully");
});
// in which b is optional
app.get("/ab?c", (req, res) => {
  res.send({ matched: "/abc or /ac" });
});
// in which bc is optional
app.get("/a(bc)?d", (req, res) => {
  res.send("matched");
});
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
//nodemon it will automatically refresh/restart the server when we make changes to the code