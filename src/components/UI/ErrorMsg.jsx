import React from "react";

const ErrorMsg = ({ errMsg }) => {
  return errMsg && <p className="error-msg">{errMsg}</p>;
};

export default ErrorMsg;
