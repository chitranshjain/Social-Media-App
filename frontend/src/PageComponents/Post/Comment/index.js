import axios from "axios";
import moment from "moment";
import React, { useContext } from "react";

import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { AuthContext } from "../../../Contexts/AuthContext";

import "./Comment.css";

const Comment = ({ comment, getPost }) => {
  const { userDetails, token } = useContext(AuthContext);

  const deleteComment = async () => {
    try {
      await axios({
        method: "DELETE",
        url: `http://localhost:8000/api/comments/${comment.postId}/${comment.id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Comment deleted");
      getPost();
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  return (
    <div className="comment-parent-div">
      <div className="user-avatar">
        <img src={comment.userId.imageUrl} alt={comment.userId.firstName} />
      </div>
      <div className="comment-content">
        <p>
          <span>
            {comment.userId.firstName} {comment.userId.lastName}
          </span>
          <span>
            <span>
              {moment(comment.createdAt).format("hh:mm A on DD MMM, YYYY")}
            </span>
          </span>
        </p>
        <p>
          {comment.comment}
          <span>
            {userDetails._id === comment.userId._id && (
              <AiOutlineDelete
                onClick={deleteComment}
                className="delete-comment-icon"
              />
            )}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Comment;
