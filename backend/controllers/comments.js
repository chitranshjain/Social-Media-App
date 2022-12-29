const { default: mongoose } = require("mongoose");
const Comment = require("../models/comments");
const Notification = require("../models/notifications");
const Post = require("../models/posts");

const addComment = async (request, response) => {
  try {
    const postId = request.params.postId;
    const { commentText } = request.body;

    let post = await Post.findById(postId);

    if (!post) throw new Error("No post found with the given ID");

    let comment = new Comment({
      comment: commentText,
      userId: request.userId,
      postId: post,
    });

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    await comment.save({ session: session });
    post.comments.push(comment._id);
    await comment.populate("userId");
    await post.save({ session: session });
    await session.commitTransaction();

    response.status(201).json({
      message: "Comment added successfully",
      data: { comment: comment },
    });
  } catch (error) {
    console.log(
      `An error occurred while adding comment to the post, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while adding comment to the post",
      error: error.message,
    });
  }
};

const removeComment = async (request, response) => {
  try {
    const { postId, commentId } = request.params;

    let post = await Post.findById(postId);
    if (!post) throw new Error("No post found with the given ID");

    let comment = await Comment.findById(commentId);
    if (!comment) throw new Error("No comment found with the given ID");

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    await comment.remove({ session: session });
    // await Notification.deleteMany({
    //   postId: postId,
    //   notificationText: "commented on your",
    //   senderId: request.userId,
    // });
    post.comments.pull(comment);
    await post.save({ session: session });
    await session.commitTransaction();

    response.status(200).json({
      message: "Comment removed successfully",
    });
  } catch (error) {
    console.log(
      `An error occurred while removing comment from the post, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while removing comment from the post",
      error: error.message,
    });
  }
};

module.exports = { addComment, removeComment };
