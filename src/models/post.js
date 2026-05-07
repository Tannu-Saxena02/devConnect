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
      default:"https://static.vecteezy.com/system/resources/previews/036/594/092/non_2x/man-empty-avatar-photo-placeholder-for-social-networks-resumes-forums-and-dating-sites-male-and-female-no-photo-images-for-unfilled-user-profile-free-vector.jpg"
    },
     repostAuthorName:{
      type:String
    },
    repostAuthorAvatar:{
      type:String,
    },
    likeByUsers:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }]
  },
  { timestamps: true },
);
 

module.exports = mongoose.model("Post", postSchema);
