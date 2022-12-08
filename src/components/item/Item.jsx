import React from "react";

export default function Item({ imageUrl, handleClick, dataValue, id, className}) {
  return (
    <div className={className} id={id}>
      <img
        src={imageUrl}
        onClick={handleClick}
        data-value={dataValue}
      />
    </div>
  );
}
