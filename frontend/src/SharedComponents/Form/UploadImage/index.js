import React, { useRef } from "react";
import { Form } from "react-bootstrap";
import { BsFillCameraFill } from "react-icons/bs";

import "./UploadImage.css";

const UploadImage = (props) => {
  const imageButtonRef = useRef();
  return (
    <div>
      <div className="upload-image-div">
        <Form.Control
          ref={imageButtonRef}
          style={{ display: "none" }}
          type="file"
          name="image"
          accept="image/*"
          onChange={props.handleImageChange}
        />
        <div
          onClick={() => {
            imageButtonRef.current.click();
          }}
          className="upload-image"
        >
          {props.imagePreview ? (
            <img
              className="image-preview"
              src={props.imagePreview}
              alt="New Post"
            />
          ) : (
            <div>
              <center>
                <BsFillCameraFill className="upload-image-icon" />
              </center>
              <p>Upload Photo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadImage;
