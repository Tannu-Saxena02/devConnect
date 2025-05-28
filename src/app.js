const express=require('express');
const app=express();


// app.use((req,res)=>{//request handler-every time it send a response to every request
//  res.send("HELLO from the server!")  
// })
// app.use("/",(req,res)=>{//request handler-every time it send a response to every request
//  res.send("HELLO from the dashboard!")   
// })
// app.use("/hello",(req,res)=>{
//  res.send("HELLO HELLO HELL !")   
// })
// app.use("/test",(req,res)=>{
//  res.send("HELLO from the test!")   
// })
//this will match to all HTTP methods API calls to /test
app.use("/users",(req,res)=>{
    res.send("HELLO from the users!")  
})
app.get("/users",(req,res)=>{
    res.send({"firstName":"Akshay","lastName":"Saini","age":25})  
})
app.post("/users",(req,res)=>{
    res.send("Data saved successfully!")  
})
app.delete("/users",(req,res)=>{
    res.send("Data delete successfully!")  
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
//nodemon it will automatically refresh/restart the server when we make changes to the code