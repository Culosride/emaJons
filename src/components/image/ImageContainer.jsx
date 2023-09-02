import React from "react";
import { Link } from "react-router-dom";

const ImageContainer = ({ mediaType, src, alt, hoverContent, linkUrl }) => {
  const handleMouseEnter = (e) => {
    e.target.play();
  };
  const handleMouseLeave = (e) => {
    e.target.load();
  };

  return (
    <Link to={linkUrl} className="image-container">
      {mediaType === "image" && <img className="image" src={src} alt={alt} />}
      {mediaType === "video" && (
        <video
          muted
          loop
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="image"
          src={src}
          alt={alt}
        />
      )}
      <div className="post-info">{hoverContent}</div>
    </Link>
  );
};

export default ImageContainer;
