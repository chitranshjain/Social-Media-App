const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const generateToken = (id) => {
  const token = jwt.sign({ id }, process.env.JWTSECRET, {
    expiresIn: "30d",
  });

  return token;
};

const generateHash = async (text) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(text, salt);
  return hash;
};

const verifyPassword = async (text1, text2) => {
  const result = await bcrypt.compare(text1, text2);
  return result;
};

const checkLogin = async (request, response, next) => {
  try {
    let token;
    if (
      !request.headers.authorization ||
      !request.headers.authorization.startsWith("Bearer")
    ) {
      throw new Error("No authentication token found");
    }

    token = request.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWTSECRET);

    if (!decodedToken.id) throw new Error("Invalid token");

    let user = await User.findById(decodedToken.id).select("-password");

    if (!user) throw new Error("Unauthorized or no user found");

    request.userId = user._id.toString();
    next();
  } catch (error) {
    console.log(`Authentication error, ERROR : ${error.message}`);
    response
      .status(500)
      .json({ message: "Authentication error", error: error.message });
  }
};

module.exports = { generateToken, generateHash, verifyPassword, checkLogin };
