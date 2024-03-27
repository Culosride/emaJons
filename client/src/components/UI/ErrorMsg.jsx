import React from "react";

const ErrorMsg = ({ errMsg }) => {
  return errMsg && <p aria-label="error message" className="error-msg">{errMsg}</p>
};

export default ErrorMsg;
