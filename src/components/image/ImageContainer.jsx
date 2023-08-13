import React, { useState } from "react";
import { Link } from "react-router-dom";

const ImageContainer = ({ src, alt, hoverContent, linkUrl }) => {
  return (
    <Link reloadDocument to={linkUrl} className="image-container">
      <img className="image" src={src} alt={alt} />
      <div className="post-info">{hoverContent}</div>
    </Link>
  );
};

export default ImageContainer;
