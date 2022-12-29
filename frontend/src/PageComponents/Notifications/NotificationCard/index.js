import React from "react";
import moment from "moment";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import "./NotificationCard.css";

const NotificationCard = ({ notification, toggleHandler }) => {
  return (
    <div
      // onClick={(e) => toggleHandler(notification._id)}
      className={`notification-card ${!notification.seen && "new"}`}
    >
      <Row>
        <Col className="notification-text-col" lg={11}>
          <p>
            <Link
              to={`/user/${notification.senderId._id}`}
              className="notification-sender"
            >
              {notification.senderId.firstName} {notification.senderId.lastName}{" "}
            </Link>
            {notification.notificationText}
            <Link to={`/post/${notification.postId._id}`}> photo</Link>
            <span>
              {moment(notification.createdAt).format("hh:mm A on DD MMM, YYYY")}
            </span>
          </p>
        </Col>
        <Col className="notification-col">
          <img
            className="notification-post-image"
            src={notification.postId.imageUrl}
            alt={notification.postId.textContent}
          />
        </Col>
      </Row>
    </div>
  );
};

export default NotificationCard;
