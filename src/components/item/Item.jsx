import React from "react";

export default function Item({ url, dataValue, id, className, toggleFullScreen}) {
  return (
    <div
      onClick={toggleFullScreen}
      className={className}
      id={id}
    >
      <img
        src={url}
        data-value={dataValue}
      />
    </div>
  );
}
