import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { reactLocalStorage } from "reactjs-localstorage";
import axios from "axios";

import SubmitButton from "../../../SharedComponents/Form/SubmitButton";
import TextInput from "../../../SharedComponents/Form/TextInput";

import "./SignUp.css";
import { AuthContext } from "../../../Contexts/AuthContext";

const SignUp = () => {
  const { getLoginStatus } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setUserData((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: "https://social-media-backend-1986.onrender.com/api/user/signup",
        data: userData,
      });
      console.log(response.data.data);
      const token = response.data.data.token;
      reactLocalStorage.set("authToken", token);
      toast.success("Successfully signed up");
      await getLoginStatus();
      navigate("/");
    } catch (error) {
      toast.error(`ERROR : ${error.response.data.error}`);
    }
  };

  return (
    <div className="signup-parent-div">
      <div className="signup-card-div">
        <h5>SIGN UP</h5>
        <div className="fields-div">
          <TextInput
            id="firstName"
            label="First Name"
            type="text"
            name="firstName"
            onChange={handleChange}
          />
          <TextInput
            id="lastName"
            label="Last Name"
            type="text"
            name="lastName"
            onChange={handleChange}
          />
        </div>
        <TextInput
          id="email"
          label="Email"
          type="email"
          name="email"
          onChange={handleChange}
        />
        <TextInput
          id="phoneNumber"
          label="Phone Number"
          type="text"
          name="phoneNumber"
          onChange={handleChange}
        />
        <div className="fields-div">
          <TextInput
            id="password"
            label="Password"
            type="password"
            name="password"
            onChange={handleChange}
          />
          <TextInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            onChange={handleChange}
          />
        </div>
        <SubmitButton onSubmit={onSubmitHandler} btnText="Sign Up" />
        <hr />
        <p>
          Already have an account?{" "}
          <Link to="/login">
            <span>Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
