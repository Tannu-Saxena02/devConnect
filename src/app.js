const express=require('express');
const app=express();


// app.use((req,res)=>{//request handler-every time it send a response to every request
//  res.send("HELLO from the server!")
    
// })
// app.use("/",(req,res)=>{//request handler-every time it send a response to every request
//  res.send("HELLO from the dashboard!")   
// })
app.use("/hello",(req,res)=>{
 res.send("HELLO HELLO HELL !")   
})
app.use("/test",(req,res)=>{
 res.send("HELLO from the test!")   
})
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
//nodemon it will automatically refresh/restart the server when we make changes to the code