const express = require("express");
const mongoose = require("mongoose");
const postsRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");
const Post = require("../models/post");
const ConnectionRequest = require("../models/connectionRequest");

const isValidPostId = (postId) => mongoose.Types.ObjectId.isValid(postId);


const addOwnerFlags = (posts, userId) =>
  posts.map((post) => {
    const isOwner = post.userId?.toString() === userId.toString();
    return {
      ...post.toObject(),
      isDeletable: isOwner,
      isEditable: isOwner,
    };
  });
// api to create a post
postsRouter.post("/createposts", userAuthentication, async (req, res) => {
  try {
    const { postContent, media, visibility } = req.body;
    const post = new Post({
      postContent,
      media,
      visibility,
      userId: req.user._id,
      authorName: req.user.firstName + " " + req.user.lastName,
      authorAvatar: req.user.photoUrl,
    });
    await post.save();
    res.status(200).send({
      success: true,
      message: "Post created successfully"
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

//get all post of the loggedin user// made some mistake
postsRouter.get("/user/posts/:userId", userAuthentication, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const posts = await Post.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.status(200).send({
      success: true,
      message: "Posts fetched successfully",
      data: addOwnerFlags(posts, req.user._id),
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// get posts made by users connected to the loggedin user
postsRouter.get("/user/allposts", userAuthentication, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: req.user._id, status: "accepted" },
        { toUserId: req.user._id, status: "accepted" },
      ],
    }).select("fromUserId toUserId");

    const connectedUserIds = connectionRequests.map((connectionRequest) =>
      connectionRequest.fromUserId.toString() === req.user._id.toString()
        ? connectionRequest.toUserId
        : connectionRequest.fromUserId,
    );
    // find post of all connected users
    const posts = await Post.find({ userId: { $in: connectedUserIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    res.status(200).send({
      success: true,
      message: "Posts fetched successfully",
      data: addOwnerFlags(posts, req.user._id),
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// api to repost a user'post
postsRouter.post( "/posts/repost/:postId", userAuthentication,async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
      if (!post) {
        return res
          .status(404)
          .send({ success: false, message: "Post not found" });
      }

      const originalPostId = post.isRepost && post.originalPostId
        ? post.originalPostId
        : post._id;
      const originalPost = await Post.findById(originalPostId);

      if (!originalPost) {
        return res
          .status(404)
          .send({ success: false, message: "Original post not found" });
      }

      const alreadyReposted = await Post.findOne({
        userId: req.user._id,
        isRepost: true,
        originalPostId,
      });

      if (alreadyReposted) {
        return res.status(400).send({
          success: false,
          error: "You have already reposted this post",
        });
      }

      const repostCount = (originalPost.repostCount || 0) + 1;

      const repost = new Post({
        postContent: post.postContent,
        media: post.media,
        visibility: post.visibility,
        userId: req.user._id,
        isRepost: true,
        originalPostId,
        repostAuthorName: req.user.firstName + " " + req.user.lastName,
        repostAuthorAvatar: req.user.photoUrl,
        authorName: post.authorName,
        authorAvatar: post.authorAvatar,
        repostCount,
        likes:post.likes,
        likeByUsers:post.likeByUsers
      });
      await repost.save();
      await Post.findByIdAndUpdate(originalPostId, { repostCount });
      // await repost.populate(
      //   "originalPostId",
      //   "postContent media userId visibility likes authorName authorAvatar repostCount likeByUsers createdAt updatedAt",
      // );
      res.status(200).send({
        success: true,
        message: "Repost created successfully",
        // data: repost,
      });
    } catch (err) {
      res.status(400).send({ success: false, error: err.message });
    }
  },
);

// to like & unlike a post
postsRouter.post("/posts/like", userAuthentication, async (req, res) => {
  try {
    const { postId } = req.body;
    if (!isValidPostId(postId)) {
      return res
        .status(400)
        .send({ success: false, error: "Valid postId is required" });
    }

    const post = await Post.findById(postId);
    if (!post)
      return res
        .status(404)
        .send({ success: false, error: "Original post not found" });

    const originalPostId = post.isRepost && post.originalPostId
      ? post.originalPostId
      : postId;

    const originalPost = await Post.findById(originalPostId);
    const alreadyLiked = originalPost.likeByUsers.some(
      (likedUserId) => likedUserId.toString() === req.user._id.toString(),
    );

    if (alreadyLiked) {
      await Post.findOneAndUpdate(
        { _id: originalPostId, likes: { $gt: 0 } },
        { $inc: { likes: -1 }, $pull: { likeByUsers: req.user._id } },
      );
      await Post.updateMany(
        { originalPostId, likes: { $gt: 0 } },
        { $inc: { likes: -1 }, $pull: { likeByUsers: req.user._id } },
      );
    } else {
      await Post.findByIdAndUpdate(originalPostId, {
        $inc: { likes: 1 },
        $addToSet: { likeByUsers: req.user._id },
      });
      await Post.updateMany({ originalPostId }, {
        $inc: { likes: 1 },
        $addToSet: { likeByUsers: req.user._id },
      });
    }
    res.status(200).send({
      success: true,
      message: "Post liked/unliked updated successfully",
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});
// to delete a post

postsRouter.delete("/posts/delete/:postId",userAuthentication,async (req, res) => {
    try {
      const postId = req.params.postId;
      if (!isValidPostId(postId)) {
        return res
          .status(400)
          .send({ success: false, error: "Valid postId is required" });
      }
      const post = await Post.findById(postId); 
      if (!post) {
        return res
          .status(404)
          .send({ success: false, error: "Post not found" });
      }
      if(post.userId.toString() !== req.user._id.toString()){
        return res
          .status(400)
          .send({ success: false, error: "You are not allowed to delete this post" });
      }
      //chck this postid is equal to any repostid in db if have then delete that repost also
      await Post.deleteMany({ originalPostId: postId });
      await post.deleteOne();
      res.status(200).send({
        success: true,
        message: "Post deleted successfully",
      });
    } catch (err) {
      res.status(400).send({ success: false, error: err.message });
    }
  },
);
// to edit the post
postsRouter.put("/posts/edit/:postId",userAuthentication,async (req, res) => {
    try {
      const postId = req.params.postId;
      const post = await Post.findById(postId);
      if (!post) {
        return res
          .status(404)
          .send({ success: false, message: "Post not found" });
      }
      const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });
      //chck this postid is equal to any repostid in db if have then update that repost also
      await Post.updateMany({ originalPostId: postId }, req.body);
      res.status(200).send({
        success: true,
        message: "Post updated successfully",
        data: updatedPost,
      });
    } catch (err) {
      res.status(400).send({ success: false, error: err.message });
    }
  },
);

// ---------------------------------------------------------NOT USED NOW---------------------------------------------------------------------
// to get user info which iked the post
postsRouter.get("/user/likes/:postId", userAuthentication, async (req, res) => {
  try {
    const likedUsersData = await Post.find({_id:req.params.postId})
    .populate("likeByUsers", "firstName lastName photoUrl")

    res.status(200).send({
      success: true,
      message: "Users who liked the post fetched successfully",
      data: likedUsersData,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});


module.exports = { postsRouter };
