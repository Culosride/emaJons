import React from "react";

function Button({ children, dataValue, disabled, type, className = "", onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      data-value={dataValue}
      type={type}
      className={`btn ${className}`}
    >
      {children}
    </ button>
  );
}

export default Button;
