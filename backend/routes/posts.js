const express = require("express");

const { imageUpload } = require("../utils/file-upload-utility");
const {
  createNewPost,
  removePost,
  getFeedPosts,
  getLoggedInUserPosts,
  getPostById,
  likePost,
  unlikePost,
} = require("../controllers/posts");
const { checkLogin } = require("../utils/auth-utility");

const router = express.Router();

router.get("/feed", checkLogin, getFeedPosts);
router.get("/self", checkLogin, getLoggedInUserPosts);
router.get("/:postId", checkLogin, getPostById);

router.post("/", checkLogin, imageUpload().single("image"), createNewPost);

router.patch("/like/:postId", checkLogin, likePost);
router.patch("/unlike/:postId", checkLogin, unlikePost);

router.delete("/:postId", checkLogin, removePost);

module.exports = router;
