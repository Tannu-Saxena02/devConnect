const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:50
    },
    lastName:{
        type:String
    },
    emailId:{
        type:String,
        lowercase:true,//validation in schema
        unique:true,
        required:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){// this validate method is only called when user is created
            if(!["male","female","other"].includes(value)){
                throw new Error("Gender data is not valid");
        }
    }
},
    photoUrl:{
        type:String,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pnrao.com%2F%3Fattachment_id%3D8917&psig=AOvVaw0o1LC2y9kynGFKhEVG1fm6&ust=1748777426992000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCNiqsdzNzY0DFQAAAAAdAAAAABAE"
    },
    skills:{
        type:[String]
    }
},
{
    timestamps: true
})
module.exports=mongoose.model("User",userSchema);//name of Model,schema