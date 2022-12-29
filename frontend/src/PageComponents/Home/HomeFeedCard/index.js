import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import moment from "moment";

import {
  AiOutlineLike,
  AiTwotoneLike,
  AiOutlineComment,
  AiOutlineShareAlt,
} from "react-icons/ai";

import { AuthContext } from "../../../Contexts/AuthContext";

import "./HomeFeedCard.css";
import { toast } from "react-toastify";
import CommentsModal from "../CommentsModal";

const HomeFeedCard = (props) => {
  const { likePost, unlikePost, getLikeStatus } = useContext(AuthContext);
  const [post, setPost] = useState(props.post);
  const [showModal, setShowModal] = useState(false);

  const copyToClipboard = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(`http://localhost:3000/post/${post._id}`);
    toast.success("Link copied to clipboard");
  };

  return (
    <Card className="home-feed-card">
      <CommentsModal
        getFeedPosts={props.getFeedPosts}
        post={post}
        comments={post.comments}
        show={showModal}
        onHide={() => setShowModal(false)}
      />
      <div className="post-creator-div">
        <img
          className="creator-image"
          src={post.creator.imageUrl}
          alt={post.creator.firstName}
        />
        <div>
          <p>
            {post.creator.firstName} {post.creator.lastName}
          </p>
          <p>
            <span>
              {moment(post.createdAt).format("hh:mm A on DD MMM, YYYY")}
            </span>
          </p>
        </div>

        <Link to={`/post/${post._id}`}>
          <FiExternalLink className="post-open-link" />
        </Link>
      </div>
      <p>{post.textContent}</p>
      <img className="post-image" src={post.imageUrl} alt={post.textContent} />
      {/* <hr /> */}
      <Row className="feed-post-actions-row">
        <Col className="action-col" xl={4} lg={4} md={4} sm={4} xs={4}>
          {getLikeStatus(post._id) ? (
            <AiTwotoneLike
              onClick={() => unlikePost(post, setPost)}
              className="action-col-icon liked-icon"
            />
          ) : (
            <AiOutlineLike
              onClick={likePost.bind(null, post, setPost)}
              className="action-col-icon"
            />
          )}
          <span>{post.likedBy.length}</span>
        </Col>
        <Col
          onClick={() => setShowModal(true)}
          className="action-col"
          xl={4}
          lg={4}
          md={4}
          sm={4}
          xs={4}
        >
          <AiOutlineComment className="action-col-icon" />{" "}
          <span>{post.comments.length}</span>
        </Col>
        <Col
          onClick={copyToClipboard}
          className="action-col"
          xl={4}
          lg={4}
          md={4}
          sm={4}
          xs={4}
        >
          <AiOutlineShareAlt className="action-col-icon" />{" "}
          {/* <span>
            <span>Share Post</span>
          </span> */}
        </Col>
      </Row>
    </Card>
  );
};

export default HomeFeedCard;
