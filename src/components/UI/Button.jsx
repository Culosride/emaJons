import React from "react";

function Button({ children, id, dataValue, disabled, type, className = "", onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      id={id}
      data-value={dataValue}
      type={type}
      className={`btn ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
