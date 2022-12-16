import React from "react";

export default function Item({ imageUrl, dataValue, id, className, toggleFullScreen}) {
  return (
    <div
      onClick={toggleFullScreen}
      className={className}
      id={id}
    >
      <img
        src={imageUrl}
        data-value={dataValue}
      />
    </div>
  );
}
