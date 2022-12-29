const { default: mongoose } = require("mongoose");
const shortId = require("shortid");

const Post = require("../models/posts");
const User = require("../models/user");
const Notification = require("../models/notifications");
const Comment = require("../models/comments");
const { uploadFileUtility } = require("../utils/file-upload-utility");

const createNewPost = async (request, response) => {
  try {
    const image = request.file;
    let textContent;
    if (request.body["textContent"]) textContent = request.body.textContent;

    const imageUrl = await uploadFileUtility(
      image,
      "Posts",
      shortId.generate()
    );

    const post = new Post({
      imageUrl: imageUrl,
      textContent: textContent,
      creator: request.userId,
      comments: [],
    });

    let user = await User.findById(request.userId);

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    await post.save({ session: session });
    user.posts.push(post);
    await user.save({ session: session });
    await session.commitTransaction();

    response
      .status(201)
      .json({ message: "Post published successfully", data: { post: post } });
  } catch (error) {
    console.log(
      `An error occurred while creating the post, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while creating the post",
      error: error.message,
    });
  }
};

const removePost = async (request, response) => {
  try {
    const postId = request.params.postId;
    let post = await Post.findById(postId);

    if (post.creator.toString() !== request.userId) {
      throw new Error("The post does not belong to the logged in user");
    }

    let user = await User.findById(request.userId);

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    await post.remove({ session: session });
    await Notification.deleteMany({ postId: postId }, { session: session });
    await Comment.deleteMany({ postId: postId }, { session: session });
    user.posts.pull(post);
    await user.save({ session: session });
    await session.commitTransaction();

    response.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log(
      `An error occurred while deleting the post, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while deleting the post",
      error: error.message,
    });
  }
};

const getFeedPosts = async (request, response) => {
  try {
    const posts = await Post.find({ creator: { $ne: request.userId } })
      .populate("creator")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          model: "User",
        },
      })
      .sort("createdAt");

    response.status(200).json({
      message: "All posts fetched successfully",
      data: { posts: posts.map((post) => post.toObject({ getters: true })) },
    });
  } catch (error) {
    console.log(
      `An error occurred while fetching the posts, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while fetching the posts",
      error: error.message,
    });
  }
};

const getLoggedInUserPosts = async (request, response) => {
  try {
    let posts = await Post.find({ creator: request.userId });
    response.status(200).json({
      message: "Posts fetched successfully",
      data: {
        posts: posts.map((post) => post.toObject({ getters: true })),
      },
    });
  } catch (error) {
    console.log(
      `An error occurred while fetching posts, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while fetching posts",
      error: error.message,
    });
  }
};

const getPostById = async (request, response) => {
  try {
    const postId = request.params.postId;
    const post = await Post.findById(postId)
      .populate("creator")
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          model: "User",
        },
      });

    if (!post) throw new Error("No Post found with the given ID");

    response.status(200).json({
      message: "Post found",
      data: { post: post.toObject({ getters: true }) },
    });
  } catch (error) {
    console.log(
      `An error occurred while fetching the post, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while fetching the post",
      error: error.message,
    });
  }
};

const likePost = async (request, response) => {
  try {
    const postId = request.params.postId;
    let post = await Post.findById(postId);

    let user = await User.findById(request.userId);

    if (
      post.likedBy.includes(request.userId) ||
      user.postsLiked.includes(postId)
    ) {
      throw new Error("Post already liked");
    }

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    post.likedBy.push(user);
    user.postsLiked.push(post);
    await post.save({ session: session });
    await user.save({ session: session });
    await session.commitTransaction();

    response.status(200).json({ message: "Post liked successfully" });
  } catch (error) {
    console.log(
      `An error occurred while liking the post, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while liking the post",
      error: error.message,
    });
  }
};

const unlikePost = async (request, response) => {
  try {
    const postId = request.params.postId;
    let post = await Post.findById(postId);

    let user = await User.findById(request.userId);

    console.log(postId, request.userId);

    const session = await mongoose.startSession();
    session.startTransaction({ session: session });
    post.likedBy.pull(user);
    user.postsLiked.pull(post);
    await Notification.deleteMany(
      {
        postId: postId,
        notificationText: "liked your",
        senderId: request.userId,
      },
      { session: session }
    );
    await post.save({ session: session });
    await user.save({ session: session });
    await session.commitTransaction();

    response.status(200).json({ message: "Post unliked successfully" });
  } catch (error) {
    console.log(
      `An error occurred while liking the post, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while liking the post",
      error: error.message,
    });
  }
};

module.exports = {
  createNewPost,
  removePost,
  getFeedPosts,
  getLoggedInUserPosts,
  getPostById,
  likePost,
  unlikePost,
};
