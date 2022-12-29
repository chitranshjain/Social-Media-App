const Notification = require("../models/notifications");
const User = require("../models/user");

const addNotification = async (request, response) => {
  try {
    const { notificationText, userId, senderId, postId } = request.body;
    let user = await User.findById(userId);

    if (!user) throw new Error("No user found for the provided ID");

    const notification = new Notification({
      userId: userId,
      notificationText: notificationText,
      seen: false,
      senderId: senderId,
      postId: postId,
    });

    await notification.save();
    response.status(201).json({
      message: "Notification added successfully",
      data: {
        notification: notification,
      },
    });
  } catch (error) {
    console.log(
      `An error occurred while adding the notification, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while adding the notification",
      error: error.message,
    });
  }
};

const getNewNotifications = async (request, response) => {
  try {
    const userId = request.userId;
    const notifications = await Notification.find({
      userId: userId,
      seen: false,
    })
      .populate("senderId")
      .populate("postId")
      .sort({ createdAt: -1 });

    response.status(200).json({
      message: "Notifications fetched successfully",
      data: {
        notifications: notifications.map((notification) =>
          notification.toObject({ getters: true })
        ),
      },
    });
  } catch (error) {
    console.log(
      `An error occurred while fetching new notifications, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while fetching new notifications",
      error: error.message,
    });
  }
};

const toggleNotificationStatus = async (request, response) => {
  try {
    await Notification.updateMany(
      {
        userId: request.userId,
      },
      {
        $set: {
          seen: true,
        },
      }
    );

    response.status(200).json({ message: "Notification status toggled" });
  } catch (error) {
    console.log(
      `An error occurred while toggling notification status, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: `An error occurred while toggling notification status`,
      error: error.message,
    });
  }
};

const getAllNotifications = async (request, response) => {
  try {
    const userId = request.userId;
    const notifications = await Notification.find({
      userId: userId,
      seen: true,
    })
      .populate("senderId")
      .populate("postId")
      .sort({
        createdAt: -1,
      });

    response.status(200).json({
      message: "Notifications fetched successfully",
      data: {
        notifications: notifications.map((notification) =>
          notification.toObject({ getters: true })
        ),
      },
    });
  } catch (error) {
    console.log(
      `An error occurred while fetching notifications, ERROR : ${error.message}`
    );
    response.status(500).json({
      message: "An error occurred while fetching notifications",
      error: error.message,
    });
  }
};

module.exports = {
  addNotification,
  getNewNotifications,
  getAllNotifications,
  toggleNotificationStatus,
};
