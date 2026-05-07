const express = require("express");
const postsRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");
const Post = require("../models/post");

// api to create a post
postsRouter.post("/createposts", userAuthentication, async (req, res) => {
  try {
    const { postContent, media, visibility } = req.body;
    const post = new Post({ postContent, media, visibility, userId: req.user._id, authorName: req.user.firstName+" "+req.user.lastName, authorAvatar: req.user.avatar });
    await post.save();
    res.status(200).send({
      success: true,
      message: "Post created successfully",
      data: post,
      authorName:req.user.firstName+" "+req.user.lastName,
      authorAvatar:req.user.avatar
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

//get all post of the loggedin user// made some mistake
postsRouter.get("/user/posts/:userId", userAuthentication, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// get all posts except loggedin user
postsRouter.get("/user/allposts", userAuthentication, async (req, res) => {
  try {
    const posts = await Post.find({ userId: { $ne: req.user._id } }).sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// api to repost a user'post
postsRouter.post("/posts/repost/:postId", userAuthentication, async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ success: false, message: "Post not found" });
    }
    const repost = new Post({
      postContent: post.postContent,
      media: post.media,
      visibility: post.visibility,
      userId: req.user._id,
      repostAuthorName: req.user.firstName+" "+req.user.lastName,
      repostAuthorAvatar: req.user.photoUrl,
      authorName: post.authorName,
      authorAvatar: post.authorAvatar
    });
    await repost.save();
    res.status(200).send({
      success: true,
      message: "Repost created successfully",
      data: repost,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// to like & unlike a post
postsRouter.post("/posts/like", userAuthentication, async (req, res) => {
  try {
    const {postId} = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).send({ success: false, message: "Post not found" });

    const alreadyLiked = post.likeByUsers.includes(req.user._id);
    if (alreadyLiked) {
      await Post.findOneAndUpdate({ _id: postId, likes: { $gt: 0 } }, { $inc: { likes: -1 }, $pull: { likeByUsers: req.user._id } });
    } else {
      await Post.findByIdAndUpdate(postId, { $inc: { likes: 1 }, $push: { likeByUsers: req.user._id } });
    }
    res.status(200).send({
      success: true,
      message: "Post liked/unliked updated successfully"
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

module.exports = { postsRouter };
