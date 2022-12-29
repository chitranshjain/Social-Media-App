const express = require("express");
const {
  getNewNotifications,
  getAllNotifications,
  addNotification,
  toggleNotificationStatus,
} = require("../controllers/notifications");
const { checkLogin } = require("../utils/auth-utility");

const router = express.Router();

router.get("/new", checkLogin, getNewNotifications);
router.get("/all", checkLogin, getAllNotifications);

router.post("/", checkLogin, addNotification);

router.patch("/", checkLogin, toggleNotificationStatus);

module.exports = router;
