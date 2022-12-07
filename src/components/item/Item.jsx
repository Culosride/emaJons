import React from "react";

export default function Item({ imageUrl, className, handleClick, dataValue }) {
  console.log('Child ITEM render')
  return (
    <img
      src={imageUrl}
      className={className}
      onClick={handleClick}
      data-value={dataValue}
    />
  );
}
