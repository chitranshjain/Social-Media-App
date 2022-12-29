const shortid = require("shortid");

const User = require("../models/user");
const { uploadFileUtility } = require("../utils/file-upload-utility");
const {
  generateHash,
  generateToken,
  verifyPassword,
} = require("../utils/auth-utility");

const registerUser = async (request, response) => {
  try {
    let { firstName, lastName, email, phoneNumber, password, confirmPassword } =
      request.body;

    let user = await User.findOne({ email: email });

    if (user) {
      throw new Error(
        "An user with the given email already exists, please try registering with a different email address or login instead."
      );
    }

    if (password !== confirmPassword) {
      throw new Error("Entered passwords do not match");
    }

    password = await generateHash(password);

    user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/social-media-app-23d8d.appspot.com/o/Users%2Fblank-profile-picture-g69990aa72_1280.png?alt=media&token=a6514625-d015-4355-991f-3d5628be33f6",
      password: password,
    });

    let token = generateToken(user._id.toString());

    await user.save();
    return response.status(201).json({
      message: "Registration successful.",
      data: { user: user, token: token },
    });
  } catch (error) {
    console.log(
      `An error occurred while registration, please try again. ERROR : ${error.message}`
    );
    return response
      .status(500)
      .json({ message: "An error occurred", data: { error: error } });
  }
};

const loginUser = async (request, response) => {
  try {
    const { email, password } = request.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("No user found with the given email.");
    }

    let passwordMatchResult = await verifyPassword(password, user.password);

    if (!passwordMatchResult) {
      throw new Error("Incorrect password");
    }

    let token = generateToken(user._id);

    response
      .status(200)
      .json({ message: "Successfully logged in", data: { token: token } });
  } catch (error) {
    console.log(`An error occurred while signing in, ERROR : ${error.message}`);
    response.status(500).json({
      message: "An error occurred while signing in.",
      error: error.message,
    });
  }
};

const updateProfilePicture = async (request, response) => {
  try {
    const image = request.file;
    const imageUrl = await uploadFileUtility(
      image,
      "Users",
      shortid.generate()
    );
    await User.findByIdAndUpdate(request.userId, {
      $set: {
        imageUrl: imageUrl,
      },
    });

    response
      .status(200)
      .json({ message: "Profile picture uploaded successfully" });
  } catch (error) {
    console.log(
      `An error occurred while updating the profile picture, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while updating the profile picture",
      error: error.message,
    });
  }
};

const verifyLogin = async (request, response) => {
  try {
    const user = await User.findById(request.userId);

    response.status(200).json({
      message: "User login verified",
      data: { user: user.toObject({ getters: true }) },
    });
  } catch (error) {
    console.log(
      `An error occurred while verifying login, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: `An error occurred while verifying the login`,
      error: error.message,
    });
  }
};

const getUserById = async (request, response) => {
  try {
    const userId = request.params.userId;
    const user = await User.findById(userId).populate({
      path: "posts",
      populate: {
        path: "creator",
        model: "User",
      },
      populate: {
        path: "comments",
        model: "Comment",
        populate: {
          path: "userId",
          model: "User",
        },
      },
    });

    response
      .status(200)
      .json({ message: "User details fetched", data: { user: user } });
  } catch (error) {
    console.log(`An error occurred, ERROR : ${error.message}`);
    response
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfilePicture,
  verifyLogin,
  getUserById,
};
