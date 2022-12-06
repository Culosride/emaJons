import React from "react";

export default function Item({ imageUrl, height }) {

  console.log('render HTML ITEM')
  return (
    <img src={imageUrl} height={height} />
  );
}
