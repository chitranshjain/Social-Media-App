import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Contexts/AuthContext";
import { toast } from "react-toastify";
import { Card, Col, Row } from "react-bootstrap";
import HomeFeedCard from "../../PageComponents/Home/HomeFeedCard";
import ProfileCard from "../../SharedComponents/ProfileCard";
import "./Home.css";
import UploadImage from "../../SharedComponents/Form/UploadImage";
import TextInput from "../../SharedComponents/Form/TextInput";
import SubmitButton from "../../SharedComponents/Form/SubmitButton";

const Home = () => {
  const { token, userDetails } = useContext(AuthContext);
  const [feedPosts, setFeedPosts] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const types = ["image/png", "image/jpeg", "image/jpg"];
  const [textContent, setTextContent] = useState("");

  const handleImageChange = (event) => {
    let selectedFile = event.target.files[0];
    if (selectedFile && types.includes(selectedFile.type)) {
      setImage(selectedFile);
      setImagePreview(URL.createObjectURL(selectedFile));
    } else {
      setImage(null);
      setImagePreview("");
    }
  };

  const handleChange = (event) => {
    event.preventDefault();
    setTextContent(event.target.value);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("textContent", textContent);
      const response = await axios({
        method: "POST",
        url: `http://localhost:8000/api/posts/`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(response.data.data);
      toast.success("Post created successfully");
      setImage(null);
      setImagePreview("");
      setTextContent("");
      // props.onHide();
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.message}`);
    }
  };

  useEffect(() => {
    getFeedPosts();
  }, []);

  const getFeedPosts = async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `http://localhost:8000/api/posts/feed`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFeedPosts(response.data.data.posts);
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  return (
    <div className="home-parent-div">
      <Row>
        <Col
          lg={{ span: 4, order: 1 }}
          md={{ span: 12, order: 1 }}
          sm={{ span: 12, order: 1 }}
          xs={{ span: 12, order: 1 }}
        >
          <ProfileCard userDetails={userDetails} />
        </Col>
        <Col
          lg={{ span: 4, order: 2 }}
          md={{ span: 12, order: 3 }}
          sm={{ span: 12, order: 3 }}
          xs={{ span: 12, order: 3 }}
        >
          <div className="home-feed">
            <Row>
              {feedPosts &&
                feedPosts.map((post) => {
                  return (
                    <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                      <HomeFeedCard getFeedPosts={getFeedPosts} post={post} />
                    </Col>
                  );
                })}
            </Row>
          </div>
        </Col>
        <Col
          lg={{ span: 4, order: 3 }}
          md={{ span: 12, order: 2 }}
          sm={{ span: 12, order: 2 }}
          xs={{ span: 12, order: 2 }}
        >
          <div className="home-new-post">
            <Card className="home-new-post-card">
              <Card.Body>
                <h5>Create A New Post</h5>
                <div className="post-form-div">
                  <UploadImage
                    imagePreview={imagePreview}
                    handleImageChange={handleImageChange}
                  />
                  <div className="post-fields-div">
                    <TextInput
                      name="textContent"
                      id="description"
                      type="text"
                      label="Description"
                      value={textContent}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <SubmitButton
                  onSubmit={onSubmitHandler}
                  btnText="Create Post"
                />
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
