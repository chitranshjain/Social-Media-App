import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { BiMailSend, BiMobileAlt } from "react-icons/bi";
import "./ProfileCard.css";

const ProfileCard = ({ userDetails }) => {
  return (
    <div className="home-profile-card-div">
      <Card className="home-profile-card">
        <Row className="hpc__user-info-div">
          <Col className="hpc__user-info-col" lg={2} md={3} sm={3} xs={3}>
            <img src={userDetails.imageUrl} alt="Profile" />
          </Col>
          <Col className="hpc__user-info-col" lg={10} md={9} sm={9} xs={9}>
            <h3>
              {userDetails.firstName} {userDetails.lastName}
            </h3>
          </Col>
        </Row>
        <hr />
        <div>
          <Row className="hpc__user-contact-info">
            <Col className="hpc__user-contact-col" lg={2} md={2} sm={2} xs={2}>
              <BiMailSend className="hpc__user-contact-icon" />
            </Col>
            <Col
              className="hpc__user-contact-col"
              lg={10}
              md={10}
              xs={10}
              sm={10}
            >
              <p>{userDetails.email}</p>
            </Col>
          </Row>
          <Row className="hpc__user-contact-info">
            <Col className="hpc__user-contact-col" lg={2} md={2} sm={2} xs={2}>
              <BiMobileAlt className="hpc__user-contact-icon" />
            </Col>
            <Col
              className="hpc__user-contact-col"
              lg={10}
              md={10}
              xs={10}
              sm={10}
            >
              <p>{userDetails.phoneNumber}</p>
            </Col>
          </Row>
        </div>
        <hr />
        <div>
          <Row className="hpc__user-contact-info">
            <Col
              className="hpc__user-contact-col"
              lg={10}
              md={10}
              xs={10}
              sm={10}
            >
              <p>Posts Shared</p>
            </Col>
            <Col className="hpc__user-contact-col" lg={2} md={2} sm={2} xs={2}>
              <p>{userDetails.posts.length}</p>
            </Col>
          </Row>
          <Row className="hpc__user-contact-info">
            <Col
              className="hpc__user-contact-col"
              lg={10}
              md={10}
              xs={10}
              sm={10}
            >
              <p>Posts Liked</p>
            </Col>
            <Col className="hpc__user-contact-col" lg={2} md={2} sm={2} xs={2}>
              <p>{userDetails.postsLiked.length}</p>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
};

export default ProfileCard;
