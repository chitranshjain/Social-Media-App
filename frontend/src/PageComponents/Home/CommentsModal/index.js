import axios from "axios";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { Col, Modal, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { AuthContext } from "../../../Contexts/AuthContext";

import "./CommentsModal.css";

const CommentsModal = (props) => {
  const { token, sendNotification } = useContext(AuthContext);
  const [comments, setComments] = useState(props.comments);
  const [comment, setComment] = useState("");

  const addComment = async (event) => {
    event.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: `https://social-media-backend-1986.onrender.com/api/comments/${props.post._id}`,
        data: {
          commentText: comment,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await sendNotification("commented", props.post);

      setComment("");
      setComments((prev) => [...prev, response.data.data.comment]);
      console.log(response.data.data.comment);
      toast.success("Comment Added Successfully");
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <div>
          <input
            className="comments-modal-input"
            placeholder="Enter your comment here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={addComment} className="comments-modal-btn">
            ADD COMMENT
          </button>
        </div>
        <hr />
        <div className="comments-div">
          <p>{comments.length} comments</p>
          <div>
            {comments.map((comment) => {
              return (
                <div className="modal-comment">
                  <Row>
                    <Col lg={3} md={4} sm={4} xs={3}>
                      <img
                        src={comment.userId.imageUrl}
                        alt={comment.userId.firstName}
                      />
                    </Col>
                    <Col lg={9} md={8} sm={8} xs={9}>
                      <p>
                        {comment.userId.firstName} {comment.userId.lastName}
                        <span>
                          {moment(comment.createdAt).format(
                            "hh:mm A on DD MMM, YYYY"
                          )}
                        </span>
                      </p>
                      <p className="comment-text">{comment.comment}</p>
                    </Col>
                  </Row>
                </div>
              );
            })}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default CommentsModal;
