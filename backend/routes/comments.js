const express = require("express");
const { addComment, removeComment } = require("../controllers/comments");
const { checkLogin } = require("../utils/auth-utility");

const router = express.Router();

router.post("/:postId", checkLogin, addComment);

router.delete("/:postId/:commentId", checkLogin, removeComment);

module.exports = router;
