import React, { useState } from "react";
import { Link } from "react-router-dom";

const ImageContainer = ({ src, alt, hoverContent, linkUrl }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <Link
      reloadDocument
      to={linkUrl}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img className="" src={src} alt={alt} />
      {isHovered && <div className="post-info">{hoverContent}</div>}
    </Link>
  );
};

export default ImageContainer;
