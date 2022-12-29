import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AuthContext } from "../../Contexts/AuthContext";
// import SubmitButton from "../../SharedComponents/Form/SubmitButton";
import NotificationCard from "../../PageComponents/Notifications/NotificationCard";

import "./Notifications.css";
import { Col, Row } from "react-bootstrap";

const Notifications = () => {
  const [newNotifications, setNewNotifications] = useState([]);
  const [oldNotifications, setOldNotifications] = useState([]);
  const { token } = useContext(AuthContext);
  // const [notificationType, setNotificationType] = useState("new");

  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    try {
      setOldNotifications([]);
      setNewNotifications([]);
      const oldresponse = await axios({
        method: "GET",
        url: `http://localhost:8000/api/notifications/all`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOldNotifications(oldresponse.data.data.notifications);

      const newresponse = await axios({
        method: "GET",
        url: `http://localhost:8000/api/notifications/new`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNewNotifications(newresponse.data.data.notifications);
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  const toggleNotificationStatus = async (notificationId) => {
    try {
      await axios({
        method: "PATCH",
        url: "http://localhost:8000/api/notifications",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      getNotifications();
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  // const toggleNotificationType = (_notificationType) => {
  //   setNotificationType(_notificationType);
  //   getNotifications(_notificationType);
  // };

  return (
    <div className="notifications-parent-div">
      <h3>Notifications</h3>
      {/* <div className="notifications-type">
        <div>
          <SubmitButton
            onSubmit={toggleNotificationType.bind(null, "new")}
            btnText="New Notifications"
            selected={notificationType === "new"}
          />
        </div>
        <div>
          <SubmitButton
            onSubmit={toggleNotificationType.bind(null, "all")}
            btnText="All Notifications"
            selected={notificationType === "all"}
          />
        </div>
      </div> */}
      <Row>
        <Col lg={6} md={12} sm={12} xs={12}>
          <div className="notifications">
            <h5>
              New Notifications
              <span>
                <button onClick={toggleNotificationStatus}>Mark as Read</button>
              </span>
            </h5>
            {newNotifications && newNotifications.length > 0 ? (
              newNotifications.map((notification) => {
                return (
                  <NotificationCard
                    key={notification._id}
                    seen={notification.seen}
                    notification={notification}
                    // toggleHandler={toggleNotificationStatus}
                  />
                );
              })
            ) : (
              <center>
                <p>No Notifications to display</p>
              </center>
            )}
          </div>
        </Col>

        <Col lg={6} md={12} sm={12} xs={12}>
          <div className="notifications">
            <h5>Old Notifications</h5>
            {oldNotifications && oldNotifications.length > 0 ? (
              oldNotifications.map((notification) => {
                return (
                  <NotificationCard
                    key={notification._id}
                    seen={notification.seen}
                    notification={notification}
                    // toggleHandler={toggleNotificationStatus}
                  />
                );
              })
            ) : (
              <center>
                <p>No Notifications to display</p>
              </center>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Notifications;
