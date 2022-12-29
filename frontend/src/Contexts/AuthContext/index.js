import React, { createContext, useEffect, useState } from "react";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";
import { toast } from "react-toastify";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
  const [token, setToken] = useState("");
  const [authStatus, setAuthStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const [postsLiked, setPostsLiked] = useState([]);

  useEffect(() => {
    getLoginStatus();
  }, []);

  const getLoginStatus = async () => {
    const token = reactLocalStorage.get("authToken");
    setIsLoading(true);
    try {
      setToken(token);
      const response = await axios({
        method: "GET",
        url: `http://localhost:8000/api/user/verifyLogin`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAuthStatus(true);
      const user = response.data.data.user;
      setUserDetails(user);
      setPostsLiked(user.postsLiked);
    } catch (error) {
      console.log(
        `An error occurred while getting authentication status, please try again.`
      );
      toast.error(`ERROR : ${error.response.data.error}`);
    }
    setIsLoading(false);
  };

  const signOut = () => {
    setAuthStatus(false);
    setUserDetails({});
    reactLocalStorage.remove("authToken");
  };

  const getLikeStatus = (postId) => {
    let likeSet = new Set(postsLiked);
    return !!likeSet.has(postId);
  };

  const likePost = async (post, setPost) => {
    try {
      await axios({
        method: "PATCH",
        url: `http://localhost:8000/api/posts/like/${post._id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await sendNotification("like", post);

      setPostsLiked((prev) => {
        return [...prev, String(post._id)];
      });
      setPost((prev) => {
        return { ...prev, likedBy: [...post.likedBy, userDetails._id] };
      });
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  const unlikePost = async (post, setPost) => {
    try {
      await axios({
        method: "PATCH",
        url: `http://localhost:8000/api/posts/unlike/${post._id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      let liked = postsLiked;
      liked = liked.filter((p) => p !== String(post._id));
      const users = post.likedBy.filter(
        (uid) => uid !== String(userDetails._id)
      );
      setPostsLiked(liked);
      setPost((prev) => {
        return { ...prev, likedBy: users };
      });
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  const sendNotification = async (notificationType, post) => {
    try {
      let notificationText =
        notificationType === "like" ? "liked your" : "commented on your";
      await axios({
        method: "POST",
        url: "http://localhost:8000/api/notifications/",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          userId: post.creator._id,
          postId: post._id,
          senderId: userDetails._id,
          notificationText: notificationText,
        },
      });
      return;
    } catch (error) {
      console.log(error);
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        authStatus,
        token,
        isLoading,
        userDetails,
        signOut,
        getLoginStatus,
        getLikeStatus,
        likePost,
        unlikePost,
        sendNotification,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
