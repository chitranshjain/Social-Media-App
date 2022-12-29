import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthContext";
import Loading from "../../Pages/Loading";
import Footer from "../Footer";
import Header from "../Header";

import "./ProtectedRoute.css";

const ProtectedRoute = (props) => {
  const { authStatus, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return <Loading />;
  } else if (!authStatus) {
    return <Navigate to="/login" replace />;
  } else {
    return (
      <div className="parent-box">
        <div className="header-box">
          <Header />
        </div>
        <div className="content-box">{props.children}</div>
        <div className="footer-box">
          <Footer />
        </div>
      </div>
    );
  }
};

export default ProtectedRoute;
