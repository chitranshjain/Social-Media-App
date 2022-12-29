import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

import Loading from "../Loading";
import SubmitButton from "../../SharedComponents/Form/SubmitButton";
import HomeFeedCard from "../../PageComponents/Home/HomeFeedCard";
import { useParams } from "react-router-dom";
import UpdateProfilePhotoModal from "../../PageComponents/Profile/UpdateProfilePhotoModal";

import "./User.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../Contexts/AuthContext";

const User = () => {
  const { token } = useContext(AuthContext);
  const { userId } = useParams();
  const [user, setUser] = useState();
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://localhost:8000/api/user/user/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data.data.user);
      setUserPosts(response.data.data.user.posts);
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  if (!user) {
    return <Loading />;
  } else {
    return (
      <div className="profile-page-parent-div">
        <UpdateProfilePhotoModal
          show={showModal}
          onHide={() => setShowModal(false)}
          imageUrl={user.imageUrl}
        />
        <Row>
          <Col xl={3} lg={4} md={6} sm={12}>
            <Card className="user-details-card">
              <div className="user-details-div">
                <img src={user.imageUrl} alt={user.firstName} />
                {/* <SubmitButton
                  onSubmit={() => setShowModal(true)}
                  btnText="Update Profile Photo"
                /> */}
                <hr />
                <Row className="details-row">
                  <Col className="details-col" lg={2} md={2} sm={2} xs={2}>
                    <AiOutlineUser className="detail-icon" />
                  </Col>
                  <Col className="details-col" lg={10} md={10} sm={10} xs={10}>
                    {user.firstName} {user.lastName}
                  </Col>
                </Row>
                <Row className="details-row">
                  <Col className="details-col" lg={2} md={2} sm={2} xs={2}>
                    <AiOutlineMail className="detail-icon" />
                  </Col>
                  <Col className="details-col" lg={10} md={10} sm={10} xs={10}>
                    {user.email}
                  </Col>
                </Row>
                <Row className="details-row">
                  <Col className="details-col" lg={2} md={2} sm={2} xs={2}>
                    <AiOutlinePhone className="detail-icon" />
                  </Col>
                  <Col className="details-col" lg={10} md={10} sm={10} xs={10}>
                    {user.phoneNumber}
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
          <Col>
            <div className="user-posts-div">
              <Row>
                {user.posts &&
                  user.posts.length > 0 &&
                  user.posts.map((post) => {
                    return (
                      <Col lg={6} md={12} sm={12} xs={12}>
                        <HomeFeedCard post={post} />
                      </Col>
                    );
                  })}
              </Row>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
};

export default User;
