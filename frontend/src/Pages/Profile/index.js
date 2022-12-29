import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { AiOutlineUser, AiOutlineMail, AiOutlinePhone } from "react-icons/ai";

import SubmitButton from "../../SharedComponents/Form/SubmitButton";
import ProfilePagePostCard from "../../PageComponents/Profile/ProfilePagePostCard";
import { AuthContext } from "../../Contexts/AuthContext";
import UpdateProfilePhotoModal from "../../PageComponents/Profile/UpdateProfilePhotoModal";

import "./Profile.css";
import axios from "axios";
import { toast } from "react-toastify";

const Profile = () => {
  const { userDetails, token } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getUserPosts();
  }, []);

  const deletePostHandler = async (postId) => {
    try {
      await axios({
        method: "DELETE",
        url: `http://localhost:8000/api/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Post Deleted");
      getUserPosts();
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  const getUserPosts = async () => {
    try {
      setUserPosts();
      const response = await axios({
        method: "GET",
        url: "http://localhost:8000/api/posts/self",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserPosts(response.data.data.posts);
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  return (
    <div className="profile-page-parent-div">
      <UpdateProfilePhotoModal
        show={showModal}
        onHide={() => setShowModal(false)}
        imageUrl={userDetails.imageUrl}
      />
      <Row>
        <Col xl={3} lg={4} md={6} sm={12}>
          <Card className="user-details-card">
            <div className="user-details-div">
              <img src={userDetails.imageUrl} alt={userDetails.firstName} />
              <SubmitButton
                onSubmit={() => setShowModal(true)}
                btnText="Update Profile Photo"
              />
              <hr />
              <Row className="details-row">
                <Col className="details-col" lg={2} md={2} sm={2} xs={2}>
                  <AiOutlineUser className="detail-icon" />
                </Col>
                <Col className="details-col" lg={10} md={10} sm={10} xs={10}>
                  {userDetails.firstName} {userDetails.lastName}
                </Col>
              </Row>
              <Row className="details-row">
                <Col className="details-col" lg={2} md={2} sm={2} xs={2}>
                  <AiOutlineMail className="detail-icon" />
                </Col>
                <Col className="details-col" lg={10} md={10} sm={10} xs={10}>
                  {userDetails.email}
                </Col>
              </Row>
              <Row className="details-row">
                <Col className="details-col" lg={2} md={2} sm={2} xs={2}>
                  <AiOutlinePhone className="detail-icon" />
                </Col>
                <Col className="details-col" lg={10} md={10} sm={10} xs={10}>
                  {userDetails.phoneNumber}
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col>
          <div className="user-posts-div">
            <Row>
              {userPosts &&
                userPosts.length > 0 &&
                userPosts.map((post) => {
                  return (
                    <Col lg={6} md={12} sm={12} xs={12}>
                      <ProfilePagePostCard
                        onDelete={deletePostHandler}
                        post={post}
                      />
                    </Col>
                  );
                })}
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
