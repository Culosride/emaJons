import React from "react";
import styles from "./ErrorMsg.module";

const ErrorMsg = ({ errMsg }) => {
  return errMsg && <p className={styles["error-msg"]}>{errMsg}</p>;
};

export default ErrorMsg;
