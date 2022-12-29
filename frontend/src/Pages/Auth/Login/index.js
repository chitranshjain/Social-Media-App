import React, { useCallback, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { reactLocalStorage } from "reactjs-localstorage";

import SubmitButton from "../../../SharedComponents/Form/SubmitButton";
import TextInput from "../../../SharedComponents/Form/TextInput";

import "./Login.css";
import { AuthContext } from "../../../Contexts/AuthContext";

const Login = () => {
  const { getLoginStatus } = useContext(AuthContext);
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setCredentials((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await axios({
        method: "POST",
        url: `https://social-media-backend-1986.onrender.com/api/user/login`,
        data: credentials,
      });
      const token = response.data.data.token;
      reactLocalStorage.set("authToken", token);
      toast.success("Successfully logged in");
      await getLoginStatus();
      navigate("/");
    } catch (error) {
      console.log(error.response.data.error);
      toast.error(`Error : ${error.response.data.error}`);
    }
  };

  return (
    <div className="login-parent-div">
      <div className="login-card-div">
        <h5>LOGIN</h5>
        <TextInput
          id="email"
          label="Email"
          type="email"
          name="email"
          onChange={handleChange}
        />
        <TextInput
          id="password"
          label="Password"
          type="password"
          name="password"
          onChange={handleChange}
        />
        <SubmitButton onSubmit={onSubmitHandler} btnText="Login" />
        <hr />
        <p>
          Need an account?{" "}
          <Link to="/signup">
            <span>Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
