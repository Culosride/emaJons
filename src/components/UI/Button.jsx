import React from "react";

function Button({ children, disabled, type, className = "", onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`btn ${className}`}
    >
      {children}
    </ button>
  );
}

export default Button;
