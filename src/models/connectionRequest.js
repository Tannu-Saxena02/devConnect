const mongoose=require('mongoose');
const User=require("./user");
//when we have millions of entries in database so query become expensive it takes so much time to do operations so we use indexing
const connectionRequestSchema=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",//reference to the user collection
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    status:{
        type:String,
        required:true,//mongondb automatically create indexes
        enum:{//schema type validation
            values:["ignored","interested","accepted","rejected"],
            message:`{VALUE} is incorrect status type`
        }
    }
},{
    timestamps:true
})
connectionRequestSchema.index({fromUserId:1,toUserId:1});//compound index
// it used when we made query with both two parameters then query become very fast when millions of records have so all job of optimization mongodb will take care of this
// we will create compound index on both field
connectionRequestSchema.pre( "save",function(next){
    const connectionRequest=this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId))
        throw new Error("Cannot send connection request to yourself");
    next();
 }
)

module.exports=new mongoose.model( "ConnectionRequest",connectionRequestSchema)