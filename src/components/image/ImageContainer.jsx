import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const ImageContainer = forwardRef(({ mediaType, handleScrollPosition, src, alt, hoverContent, linkUrl }, ref) => {
  const handleMouseEnter = (e) => {
    e.target.play();
  };
  const handleMouseLeave = (e) => {
    e.target.load();
  };

  const content = ref ?
    (
      <Link onClick={handleScrollPosition} to={linkUrl} ref={ref} className="image-container">
        {mediaType === "image" && <img className={"image"} src={src} alt={alt} />}
        {mediaType === "video" && (
          <video className={"image"} onMouseEnter={handleMouseEnter} alt={alt} onMouseLeave={handleMouseLeave} loop muted>
            <source src={src} type="video/mp4"/>
            <source src={src} type="video/mov"/>
          </video>
        )}
        <div className="post-info">{hoverContent}</div>
      </Link>
    ) :
    (
      <Link onClick={handleScrollPosition} to={linkUrl} className="image-container">
        {mediaType === "image" && <img className={"image"} src={src} alt={alt} />}
        {mediaType === "video" && (
          <video className="image" onMouseEnter={handleMouseEnter} alt={alt} onMouseLeave={handleMouseLeave} loop muted>
            <source src={src} type="video/mp4"/>
            <source src={src} type="video/mov"/>
          </video>
        )}
        <div className="post-info">{hoverContent}</div>
      </Link>
    )

  return content
});

export default ImageContainer;
