const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = new Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notificationText: {
      type: String,
      required: true,
    },
    postId: {
      ref: "Post",
      type: mongoose.Types.ObjectId,
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    senderId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
