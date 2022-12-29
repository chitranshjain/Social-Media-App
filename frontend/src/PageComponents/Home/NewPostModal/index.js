import React, { useContext, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import axios from "axios";

import TextInput from "../../../SharedComponents/Form/TextInput";
import SubmitButton from "../../../SharedComponents/Form/SubmitButton";
import UploadImage from "../../../SharedComponents/Form/UploadImage";
import { AuthContext } from "../../../Contexts/AuthContext";

import "./NewPostModal.css";

function NewPostModal(props) {
  const { token } = useContext(AuthContext);
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
        url: `https://social-media-backend-1986.onrender.com/api/posts/`,
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
      props.onHide();
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.message}`);
    }
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create A New Post
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
      </Modal.Body>
      <Modal.Footer>
        <SubmitButton onSubmit={onSubmitHandler} btnText="Create Post" />
      </Modal.Footer>
    </Modal>
  );
}

export default NewPostModal;
