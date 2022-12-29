import moment from "moment";
import React, { useContext, useState } from "react";
import { Card } from "react-bootstrap";
import { AiOutlineDelete } from "react-icons/ai";
import { FiExternalLink } from "react-icons/fi";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Contexts/AuthContext";

import "./ProfilePagePostCard.css";

const ProfilePagePostCard = (props) => {
  const [post, setPost] = useState(props.post);
  const { userDetails } = useContext(AuthContext);

  return (
    <Card className="profile-feed-card">
      <div className="post-creator-div">
        <img
          className="creator-image"
          src={userDetails.imageUrl}
          alt={userDetails.firstName}
        />
        <div>
          <p>
            {userDetails.firstName} {userDetails.lastName}
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
      <hr />
      <img className="post-image" src={post.imageUrl} alt={post.textContent} />
      <p>{post.textContent}</p>
      <hr />
      <p
        id={post._id}
        onClick={props.onDelete.bind(null, post._id)}
        className="delete-btn"
      >
        <AiOutlineDelete className="delete-icon" />
        <span>Delete Post</span>
      </p>
    </Card>
  );
};

export default ProfilePagePostCard;
