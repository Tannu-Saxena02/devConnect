const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postContent: {
      type: String,
      required: true,
    },
    media: {
      type: [String],
      default: [],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    visibility: {
      type: String,
      enum: ["public", "private", "connections"],
      default: "public",
    },
    likes:{
      type:Number,
      default:0
    },
    authorName:{
      type:String
    },
    authorAvatar:{
      type:String,
      default:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    },
     repostAuthorName:{
      type:String
    },
    repostAuthorAvatar:{
      type:String,
    }
  },
  { timestamps: true },
);

module.exports = mongoose.model("Post", postSchema);
