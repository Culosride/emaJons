import React from "react";

function Button({ children, id, hasIcon, dataValue, disabled, type = "button", className = "", onClick }) {

  const btnContent = hasIcon ? <span id={id} className={`icon icon--${className}`} >{children}</span> : children



  return (
    <button
      onClick={onClick}
      disabled={disabled}
      id={id}
      data-value={dataValue}
      type={type}
      className={`btn btn--${className}`}
    >
      {btnContent}
    </button>
  );
}

export default Button;
