// Package Imports
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const { initializeApp } = require("firebase/app");
const { firebaseConfig } = require("./utils/firebase-config");

// Route Imports
const userRoutes = require("./routes/user");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const notificationRoutes = require("./routes/notifications");

const { connectDB } = require("./db/index");

const app = express();
dotenv.config();

// Third party middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/user/", userRoutes);
app.use("/api/posts/", postRoutes);
app.use("/api/comments/", commentRoutes);
app.use("/api/notifications/", notificationRoutes);

initializeApp(firebaseConfig);

connectDB(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(
      `The server is up and running on port ${process.env.PORT || 3000}`
    );
  });
});
