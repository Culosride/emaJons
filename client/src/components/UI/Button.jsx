import React from "react";

function Button({ children, style, id, hasIcon, dataValue, disabled, type = "button", className = "", onClick }) {

  const btnContent = hasIcon ? <span id={id} className={`icon icon--${className}`} >{children}</span> : children

  return (
    <button
      className={`btn btn--${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      id={id}
      data-value={dataValue}
      type={type}
    >
      {btnContent}
    </button>
  );
}

export default Button;
