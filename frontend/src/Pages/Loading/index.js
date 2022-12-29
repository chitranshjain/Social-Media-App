import React from "react";
import Spinner from "react-bootstrap/Spinner";

import "./Loading.css";

const Loading = () => {
  return (
    <div className="loading-parent">
      <Spinner className="loading-spinner" animation="border" role="status" />
    </div>
  );
};

export default Loading;
