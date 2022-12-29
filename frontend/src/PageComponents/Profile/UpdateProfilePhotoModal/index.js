import React, { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import axios from "axios";

import SubmitButton from "../../../SharedComponents/Form/SubmitButton";
import UploadImage from "../../../SharedComponents/Form/UploadImage";
import { AuthContext } from "../../../Contexts/AuthContext";

import "./UpdateProfilePhotoModal.css";

function UpdateProfilePhotoModal(props) {
  const { token, getLoginStatus } = useContext(AuthContext);
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState(null);
  const types = ["image/png", "image/jpeg", "image/jpg"];

  useEffect(() => {
    setImagePreview(props.imageUrl);
  }, [props]);

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

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await axios({
        method: "PATCH",
        url: `https://social-media-backend-1986.onrender.com/api/user/profile-picture`,
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profile Picture updated successfully");
      setImage(null);
      setImagePreview("");
      getLoginStatus();
      props.onHide();
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.message}`);
    }
  };

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Profile Photo
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="post-form-div">
          <UploadImage
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <SubmitButton onSubmit={onSubmitHandler} btnText="Update Photo" />
      </Modal.Footer>
    </Modal>
  );
}

export default UpdateProfilePhotoModal;
