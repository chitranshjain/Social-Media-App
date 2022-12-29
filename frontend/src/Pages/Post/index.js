import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../Contexts/AuthContext";
import Comment from "../../PageComponents/Post/Comment";
import SubmitButton from "../../SharedComponents/Form/SubmitButton";
import TextInput from "../../SharedComponents/Form/TextInput";

import {
  AiOutlineLike,
  AiTwotoneLike,
  AiOutlineComment,
  AiOutlineShareAlt,
} from "react-icons/ai";

import "./Post.css";

const Post = () => {
  const { token, sendNotification, getLikeStatus, likePost, unlikePost } =
    useContext(AuthContext);
  const { postId } = useParams();

  const [comment, setComment] = useState("");
  const [post, setPost] = useState();

  useEffect(() => {
    getPost();
  }, []);

  const copyToClipboard = (event) => {
    event.preventDefault();
    navigator.clipboard.writeText(`http://localhost:3000/post/${post._id}`);
    toast.success("Link copied to clipboard");
  };

  const getPost = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://localhost:8000/api/posts/${postId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPost(response.data.data.post);
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      await axios({
        method: "POST",
        url: `http://localhost:8000/api/comments/${postId}`,
        data: {
          commentText: comment,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await sendNotification("commented", post);

      setComment("");
      toast.success("Comment Added Successfully");
      getPost();
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    setComment(event.target.value);
  };

  return (
    <div className="post-parent-div">
      {post && (
        <Card className="post-card">
          <div className="creator-info-div">
            <img
              className="post-creator-image"
              src={post.creator.imageUrl}
              alt={post.creator.firstName}
            />
            <div>
              <p>
                {post.creator.firstName} {post.creator.lastName}
              </p>
              <p>
                <span>
                  {moment(post.createdAt).format("hh:MM A on DD MMM, YYYY")}
                </span>
              </p>
            </div>
          </div>
          <hr />
          <div className="post-details">
            <p>{post.textContent}</p>
            <img
              className="post-page-image"
              src={post.imageUrl}
              alt={post.textContent}
            />
          </div>
          <hr />
          <Row>
            <Col className="post-action-col" xl={4} lg={4} md={4} sm={4} xs={4}>
              <p>
                {getLikeStatus(postId) ? (
                  <AiTwotoneLike
                    onClick={() => unlikePost(post, setPost)}
                    className="post-action-icon liked-icon"
                  />
                ) : (
                  <AiOutlineLike
                    onClick={likePost.bind(null, post, setPost)}
                    className="post-action-icon"
                  />
                )}{" "}
                {post.likedBy.length}
                <span> Likes</span>
              </p>
            </Col>
            <Col className="post-action-col" xl={4} lg={4} md={4} sm={4} xs={4}>
              <p>
                <AiOutlineComment className="post-action-icon" />{" "}
                {post.comments.length} <span>Comments</span>
              </p>
            </Col>
            <Col
              onClick={copyToClipboard}
              className="post-action-col"
              xl={4}
              lg={4}
              md={4}
              sm={4}
              xs={4}
            >
              <p>
                <AiOutlineShareAlt className="post-action-icon" />{" "}
                <span> Share Post</span>
              </p>
            </Col>
          </Row>
          <div className="post-comments">
            {/* <p>{post.comments.length} comments</p> */}
            <div className="add-comment-div">
              <TextInput
                placeholder="Write a comment here..."
                value={comment}
                onChange={handleChange}
              />
              <SubmitButton onSubmit={onSubmitHandler} btnText="Add Comment" />
            </div>
            {post.comments.map((comment) => {
              return <Comment getPost={getPost} comment={comment} />;
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Post;
