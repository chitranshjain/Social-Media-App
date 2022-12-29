const express = require("express");

const { imageUpload } = require("../utils/file-upload-utility");
const {
  registerUser,
  loginUser,
  updateProfilePicture,
  verifyLogin,
  getUserById,
} = require("../controllers/user");
const { checkLogin } = require("../utils/auth-utility");

const router = express.Router();

router.get("/verifyLogin", checkLogin, verifyLogin);
router.get("/user/:userId", checkLogin, getUserById);

router.post("/login", loginUser);
router.post("/signup", registerUser);

router.patch(
  "/profile-picture",
  checkLogin,
  imageUpload().single("image"),
  updateProfilePicture
);

module.exports = router;
