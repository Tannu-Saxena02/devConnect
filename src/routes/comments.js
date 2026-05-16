const express = require("express");
const mongoose = require("mongoose");
const commentsRouter = express.Router();
const { userAuthentication } = require("../middlewares/auth");
const Comment = require("../models/comment");
const Post = require("../models/post");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. CREATE COMMENT OR NESTED REPLY
commentsRouter.post("/createComment/:postId", userAuthentication, async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, parentCommentId } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).send({ success: false, error: "Content is required" });
    }

    if (!isValidId(postId)) {
      return res.status(400).send({ success: false, error: "Invalid post ID" });
    }

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ success: false, error: "Post not found" });
    }

    // Create comment
    const comment = new Comment({
      postId,
      userId: req.user._id,
      content,
      parentCommentId: parentCommentId || null,
    });

    await comment.save();

    // If it's a nested reply, add to parent's replies array
    if (parentCommentId) {
      if (!isValidId(parentCommentId)) {
        return res.status(400).send({ success: false, error: "Invalid parent comment ID" });
      }
      await Comment.findByIdAndUpdate(
        parentCommentId,
        { $push: { replies: comment._id } },
        { new: true }
      );
    }

    // const populatedComment = await comment.populate("userId", "firstName lastName photoUrl");

    res.status(201).send({
      success: true,
      message: "Comment created successfully",
    //   data: populatedComment,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// 2. GET SINGLE COMMENT WITH ALL NESTED REPLIES (RECURSIVE)
commentsRouter.get("/nestedreplies/:commentId", userAuthentication, async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!isValidId(commentId)) {
      return res.status(400).send({ success: false, error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId)
      .populate("userId", "firstName lastName photoUrl")
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "firstName lastName photoUrl",
        },
      })
      .populate("likes", "firstName lastName");

    if (!comment) {
      return res.status(404).send({ success: false, error: "Comment not found" });
    }

    res.status(200).send({
      success: true,
      message: "Comment fetched successfully",
      data: comment,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// 3. GET ALL TOP-LEVEL COMMENTS FOR A POST (WITH PAGINATION)
commentsRouter.get("/post/:postId", userAuthentication, async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!isValidId(postId)) {
      return res.status(400).send({ success: false, error: "Invalid post ID" });
    }

    const skip = (page - 1) * limit;

    const comments = await Comment.find({
      postId,
      parentCommentId: null, // Only top-level comments
    })
      .populate("userId", "firstName lastName photoUrl")
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "firstName lastName photoUrl",
        },
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Comment.countDocuments({ postId, parentCommentId: null });

    res.status(200).send({
      success: true,
      message: "Comments fetched successfully",
      data: comments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});


//------------------------------------------------------- not used now ------------------------------------
// 4. UPDATE/EDIT COMMENT (OWNER ONLY)
commentsRouter.put("/:commentId", userAuthentication, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!isValidId(commentId)) {
      return res.status(400).send({ success: false, error: "Invalid comment ID" });
    }

    if (!content || !content.trim()) {
      return res.status(400).send({ success: false, error: "Content is required" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send({ success: false, error: "Comment not found" });
    }

    // Check if user is the owner
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ success: false, error: "Not authorized to update this comment" });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    )
      .populate("userId", "firstName lastName photoUrl")
      .populate("likes", "firstName lastName");

    res.status(200).send({
      success: true,
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// 5. DELETE COMMENT (OWNER ONLY) - RECURSIVE DELETE OF NESTED REPLIES
commentsRouter.delete("/:commentId", userAuthentication, async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!isValidId(commentId)) {
      return res.status(400).send({ success: false, error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send({ success: false, error: "Comment not found" });
    }

    // Check if user is the owner
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).send({ success: false, error: "Not authorized to delete this comment" });
    }

    // Recursively delete all nested replies
    const deleteReplies = async (replies) => {
      for (const replyId of replies) {
        const reply = await Comment.findById(replyId);
        if (reply && reply.replies.length > 0) {
          await deleteReplies(reply.replies);
        }
        await Comment.findByIdAndDelete(replyId);
      }
    };

    await deleteReplies(comment.replies);

    // Remove from parent comment's replies array or post's comments array
    if (comment.parentCommentId) {
      await Comment.findByIdAndUpdate(
        comment.parentCommentId,
        { $pull: { replies: commentId } },
        { new: true }
      );
    } else {
      await Post.findByIdAndUpdate(
        comment.postId,
        { $pull: { comments: commentId } },
        { new: true }
      );
    }

    // Delete the comment itself
    await Comment.findByIdAndDelete(commentId);

    res.status(200).send({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// 6. LIKE A COMMENT
commentsRouter.post("/:commentId/like", userAuthentication, async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!isValidId(commentId)) {
      return res.status(400).send({ success: false, error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send({ success: false, error: "Comment not found" });
    }

    // Check if user already liked
    if (comment.likes.includes(req.user._id)) {
      return res.status(400).send({ success: false, error: "You already liked this comment" });
    }

    // Add like
    comment.likes.push(req.user._id);
    comment.likeCount = comment.likes.length;

    await comment.save();

    const updatedComment = await comment.populate("likes", "firstName lastName");

    res.status(200).send({
      success: true,
      message: "Comment liked successfully",
      data: updatedComment,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

// 7. UNLIKE A COMMENT
commentsRouter.delete("/:commentId/like", userAuthentication, async (req, res) => {
  try {
    const { commentId } = req.params;

    if (!isValidId(commentId)) {
      return res.status(400).send({ success: false, error: "Invalid comment ID" });
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).send({ success: false, error: "Comment not found" });
    }

    // Check if user liked this comment
    if (!comment.likes.includes(req.user._id)) {
      return res.status(400).send({ success: false, error: "You haven't liked this comment" });
    }

    // Remove like
    comment.likes = comment.likes.filter(
      (likeUserId) => likeUserId.toString() !== req.user._id.toString()
    );
    comment.likeCount = comment.likes.length;

    await comment.save();

    const updatedComment = await comment.populate("likes", "firstName lastName");

    res.status(200).send({
      success: true,
      message: "Comment unliked successfully",
      data: updatedComment,
    });
  } catch (err) {
    res.status(400).send({ success: false, error: err.message });
  }
});

module.exports = commentsRouter;